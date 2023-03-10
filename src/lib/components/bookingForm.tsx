import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AssetTypeQtyPicker from "./AssetTypeQtyPicker";
import ComboBox from "./ComboBox";
import type { Date } from "./DatePicker";
import DatePicker from "./DatePicker";
import type { ElegibleTime } from "./ElegibleTimePicker";
import ElegibleTimePicker from "./ElegibleTimePicker";
import Input from "./Input";
import Label from "./Label";
import { useNamespace } from "./NamespaceProvider";
import RecurrencyPicker from "./RecurrencyPicker";
import Switch from "./Switch";
import { api } from "../../utils/api";
import Button from "./Button";
import type { Booking } from "@prisma/client";
import type { FullBooking } from "../../server/api/routers/bookings/bookings";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { apiOperation } from "../util/errors";
import { useRouter } from "next/router";
import { nameOf } from "../../utils/names";

interface BookingFormProps {
    booking?: FullBooking
    onSave?: (booking: Booking) => unknown
}

export default function BookingForm({ booking, onSave, }: BookingFormProps) {
    const { data: isAdmin } = api.namespace.isAdmin.useQuery()
    const { data: users } = api.namespace.users.useQuery(undefined, { enabled: isAdmin })
    const { data: user } = api.namespace.currentUser.useQuery(undefined)

    const namespace = useNamespace()
    const { data: session } = useSession()

    const isEditing = !!booking

    const [requestedBy, setRequestedBy] = useState<string | null>(null)

    useEffect(() => {
        if (!requestedBy && user) {
            setRequestedBy(user.id || null)
        }
    }, [requestedBy, user])

    const router = useRouter()

    const [useType, setUseType] = useState<string>(booking?.useType || '')
    const [comment, setComment] = useState<string>(booking?.comment || '')
    const [hidden, setHidden] = useState<boolean>(booking?.hidden || false)
    const [error, setError] = useState<string>('')

    const [fromDate, setFromDate] = useState<Date | null>(booking ? {
        day: booking.from.date.day,
        month: booking.from.date.month,
        year: booking.from.date.year,
    } : null)

    const [toDate, setToDate] = useState<Date | null>(booking ? {
        day: booking.to.date.day,
        month: booking.to.date.month,
        year: booking.to.date.year,
    } : null)

    const [fromTime, setFromTime] = useState<ElegibleTime>({
        id: booking?.from.timeId || '',
    })
    const [toTime, setToTime] = useState<ElegibleTime>({
        id: booking?.to.timeId || '',
    })

    const [recurrencyEnabled, setRecurrencyEnabled] = useState(booking?.poolId ? true : false)
    const [recurrency, setRecurrency] = useState((booking?.pool?._count.bookings || 1) - 1)

    const toDateIsSameAsFrom = !namespace?.multiDayBooking



    useEffect(() => {
        toDateIsSameAsFrom && setToDate(fromDate)
    }, [fromDate, toDateIsSameAsFrom])

    const { data: types } = api.assetType.getAll.useQuery()

    const fetchAvailabilityEnabled = !!(fromDate?.day && fromDate?.month && fromDate?.year) && !!(toDate?.day && toDate?.month && toDate?.year) && !!(fromTime?.id) && !!(toTime?.id)
    const { data: bookableEquipmentAvailability } = api.bookings.bookableEquipmentAvailability.useQuery({
        start: {
            date: {
                day: fromDate?.day || 0,
                month: fromDate?.month || 0,
                year: fromDate?.year || 0
            },
            timeId: fromTime?.id || ''
        },
        end: {
            date: {
                day: toDate?.day || 0,
                month: toDate?.month || 0,
                year: toDate?.year || 0
            },
            timeId: toTime?.id || ''
        },
        excludeBookingId: booking?.id || null,
        repeatWeekly: recurrencyEnabled ? recurrency : 0
    }, { enabled: fetchAvailabilityEnabled, refetchInterval: 1000 * 5 })

    const [items, setItems] = useState<Map<string, number>>(booking ? () => {
        const map = new Map<string, number>()
        booking.equipment.forEach(e => map.set(e.assetTypeId, e.quantity))
        return map
    } : new Map<string, number>())

    function setQtyOf(typeId: string, qty: number) {
        const map = new Map(items).set(typeId, qty)
        if (qty === 0) {
            map.delete(typeId)
        }
        setItems(map)
    }

    function qtyOf(typeId: string) {
        const num = items.get(typeId) || 0
        const av = bookableEquipmentAvailability?.get(typeId)
        if (av && av < num) {
            return av
        }
        if (!av && bookableEquipmentAvailability) return 0
        return num
    }

    const { mutateAsync: createOrUpdate } = api.bookings.createOrUpdate.useMutation()
    const { mutateAsync: deleteSingle } = api.bookings.deleteSingle.useMutation()
    const { mutateAsync: deleteFull } = api.bookings.deleteFull.useMutation()


    async function handleSave() {
        const result = await apiOperation({
            async action() {
                const data = await createOrUpdate({
                    id: booking?.id || undefined,
                    requestedBy: requestedBy || '',
                    useType,
                    hidden,
                    start: {
                        date: {
                            day: fromDate?.day || 0,
                            month: fromDate?.month || 0,
                            year: fromDate?.year || 0
                        },
                        timeId: fromTime?.id || ''
                    },
                    end: {
                        date: {
                            day: toDate?.day || 0,
                            month: toDate?.month || 0,
                            year: toDate?.year || 0
                        },
                        timeId: toTime?.id || ''
                    },
                    repeatWeeks: recurrency,
                    comment,
                    equipment: [...items.entries()].map(([typeId, qty]) => ({ typeId, qty })).reduce((acc, curr) => {
                        acc.set(curr.typeId, qtyOf(curr.typeId))
                        return acc
                    }, new Map<string, number>())
                })
                onSave?.(data.main)
            },
            onApiError(error) {
                if (error.cause === 'NOT_AVAILABLE') {
                    setError('No hay disponibilidad para los equipos seleccionados, asegurese de seleccionar el tipo de equipo que quiere reservar')
                    return
                }
                setError(error.message)
            },
        })

    }

    return <div>
        <p className="my-0.5 font-semibold text-red-500">
            {error}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex flex-col sm:grid grid-flow-row sm:grid-cols-[7fr_5fr] gap-2 mb-auto">
                <div>
                    <ComboBox
                        options={!users ? [
                            { label: nameOf(session?.user, 'Yo') , value: session?.user.id || '', picture: session?.user.image },
                        ] : users.map(user => {
                            return {
                                label: nameOf(user),
                                value: user.id,
                            }
                        })}
                        onChange={setRequestedBy}
                        value={requestedBy}
                        label="Pedido por"
                    />
                </div>
                <div>
                    <Label>Donde/como se va a usar</Label>
                    <Input
                        placeholder="Ejemplo: Aula 5, matemática "
                        onChange={e => setUseType(e.target.value)}
                        type="text" id="useType" name="name"
                        value={useType} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Desde</label>
                    <DatePicker
                        disabled={!!(isEditing && booking?.poolId)}
                        value={fromDate}
                        onChange={setFromDate}
                    />
                </div>
                <div>
                    <label className="sm:block text-sm font-medium text-gray-700 hidden md:block">Horario</label>
                    <ElegibleTimePicker
                        disabled={!!(isEditing && booking?.poolId)}
                        value={fromTime}
                        onChange={setFromTime}
                        maxExcludeId={toTime?.id}
                    />
                </div>

                <div className={classNames({
                    'hidden sm:block': toDateIsSameAsFrom
                })}>

                    <Label>Hasta</Label>
                    <DatePicker
                        disabled={toDateIsSameAsFrom || !!(isEditing && booking?.poolId)}
                        value={toDate}
                        onChange={setToDate}
                    />
                </div>
                <div>
                    {toDateIsSameAsFrom && <Label className="sm:hidden">Hasta</Label>}
                    {toDateIsSameAsFrom && <Label className="hidden sm:block">Horario</Label>}
                    {!toDateIsSameAsFrom && <Label>Horario</Label>}
                    <ElegibleTimePicker
                        disabled={!!(isEditing && booking?.poolId)}
                        value={toTime}
                        onChange={setToTime}
                        minExcludeId={fromTime?.id}
                    />
                </div>

                {!isEditing && <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pedido recurrente</label>
                        <Switch
                            value={recurrencyEnabled}
                            onChange={setRecurrencyEnabled}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repetir hasta (inclusive)</label>
                        <RecurrencyPicker
                            disabled={!recurrencyEnabled}
                            initialDate={fromDate}
                            vale={recurrency}
                            onChange={setRecurrency}
                        />
                    </div>
                </>}
                <div className="col-span-2">
                    <Label>Comentario (opcional)</Label>
                    <Input value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
                {(isEditing && booking.pool && namespace) && <div className="col-span-2">
                    <p className="font-semibold">
                        El pedido es recurrente por {booking.pool?._count.bookings} semanas
                        &nbsp;
                        <Link href={`/${namespace.slug}/bookings?pool=${booking.pool.id}`} className="text-blue-500">ver fechas</Link>
                    </p>
                </div>}
            </div>
            <div>
                <Label>Elegir equipamiento</Label>
                {types?.map(type => {
                    return <AssetTypeQtyPicker
                        key={type.id}
                        name={type.name}
                        max={bookableEquipmentAvailability?.get(type.id) || 1000}
                        min={0}
                        value={qtyOf(type.id)}
                        onChange={qty => setQtyOf(type.id, qty)}
                    />
                })}
            </div>
            <div>
                {(isEditing && isAdmin) && <>
                    <Label>Ocultar</Label>
                    <Switch
                        value={hidden}
                        onChange={setHidden}
                        clsasName="mb-2"
                    />
                </>}
                <Button className="w-full"
                    onClick={() => void handleSave()}
                >
                    {isEditing ? 'Guardar cambios' : 'Crear'}
                </Button>
                {isEditing && <>
                    {booking?.poolId && <div className="grid md:grid-cols-2">
                        <DeleteButton onConfirmDelete={async () => {
                            if (!booking.poolId) return
                            if (!namespace) return
                            await deleteFull(booking.poolId).catch(console.error)
                            await router.push(`/${namespace.slug}/bookings`)
                        }}>Eliminar todas las fechas</DeleteButton>
                        <div className="sm:flex sm:justify-end">
                            <DeleteButton onConfirmDelete={async () => {
                                if (!booking.id) return
                                if (!namespace) return
                                await deleteSingle(booking.id).catch(console.error)
                                await router.push(`/${namespace.slug}/bookings`)
                            }}>Eliminar solo esta fecha</DeleteButton>
                        </div>
                    </div>}
                    {!booking?.poolId && <DeleteButton onConfirmDelete={async () => {
                        if (!booking.id) return
                        if (!namespace) return
                        await deleteSingle(booking.id).catch(console.error)
                        await router.push(`/${namespace.slug}/bookings`)
                    }}>Eliminar</DeleteButton>}
                </>}
            </div>
        </div>
    </div>
}