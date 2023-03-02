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
import dayjs from "dayjs";
import Link from "next/link";

interface BookingFormProps {
    booking?: FullBooking
    onSave?: (booking: Booking) => unknown
}

export default function BookingForm({ booking, onSave, }: BookingFormProps) {

    const namespace = useNamespace()
    const { data: session } = useSession()

    const isEditing = !!booking

    const [requestedBy, setRequestedBy] = useState(session?.user.id)

    useEffect(() => {
        if (!requestedBy && session?.user.id) {
            setRequestedBy(session?.user.id)
        }
    }, [requestedBy, session, session?.user.id])


    const [useType, setUseType] = useState<string>(booking?.useType || '')
    const [comment, setComment] = useState<string>(booking?.comment || '')

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

    async function handleSave() {
        const data = await createOrUpdate({
            id: booking?.id || undefined,
            requestedBy: requestedBy || '',
            useType,
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
    }

    return <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="grid sm:grid-cols-1 md:grid-cols-[7fr_5fr] gap-2 mb-auto">
            <div>
                <ComboBox
                    options={[
                        { label: session?.user.name || 'Yo', value: session?.user.id || '', picture: session?.user.image },
                    ]}
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
                    value={fromDate}
                    onChange={setFromDate}
                />
            </div>
            <div>
                <label className="sm:block text-sm font-medium text-gray-700 hidden md:block">Horario</label>
                <ElegibleTimePicker
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
                    disabled={toDateIsSameAsFrom}
                    value={toDate}
                    onChange={setToDate}
                />
            </div>
            <div>
                {toDateIsSameAsFrom && <Label className="sm:hidden">Hasta</Label>}
                {toDateIsSameAsFrom && <Label className="hidden sm:block">Horario</Label>}
                {!toDateIsSameAsFrom && <Label>Horario</Label>}
                <ElegibleTimePicker
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
            <Button className="w-full"
                onClick={() => void handleSave()}
            >
                Crear
            </Button>
        </div>
    </div>
}