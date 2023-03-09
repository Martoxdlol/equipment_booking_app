import classNames from "classnames";
import dayjs from "dayjs";
import { useQueryState } from "next-usequerystate";
import Image from "next/image";
import { useState } from "react";
import BookingAssetIndicator from "../../../lib/components/BookingAssetIndicator";
import Button from "../../../lib/components/Button";
import ComboBox from "../../../lib/components/ComboBox";
import Label from "../../../lib/components/Label";
import Switch from "../../../lib/components/Switch";
import ElegibleTimePicker from "../../../lib/components/ElegibleTimePicker";
import DashboardLayout from "../../../lib/layouts/Dashboard";
import NamespaceAdminRoute from "../../../lib/layouts/NamespaceAdminRoute";
import namespaceRow from "../../../lib/util/namespaceRow";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";

export default function DashboardDeploy() {
    return <NamespaceAdminRoute>
        {function Render({ namespace }) {
            const now = dayjs()
            const tomorrow = dayjs().add(1, 'day')
            const day = now.get('date')
            const month = now.get('month') + 1
            const year = now.get('year')

            const dayTo = tomorrow.get('date')
            const monthTo = tomorrow.get('month') + 1
            const yearTo = tomorrow.get('year')

            const router = useRouter()

            const defUser = router.query.user?.toString() || null
            const defBooking = router.query.booking?.toString() || null

            const [user, setUser] = useState<string | null>(defUser)

            const [fromTimeId, setFromTimeId] = useState<string | null>(null)
            const [toTimeId, setToTimeId] = useState<string | null>(null)

            const { data: users } = api.namespace.users.useQuery()

            const { data: assetTypes, refetch: refetchTypes } = api.assetType.getAllDetailed.useQuery({ includeAssets: true })
            const { data: bookings, refetch: refetchBookings } = api.bookings.getAllAsAdmin.useQuery({
                from: {
                    date: { day, month, year },
                },
                to: {
                    date: { day: dayTo, month: monthTo, year: yearTo },
                }
            })

            const [selection, setSelection] = useState<Set<string>>(new Set())
            const [selectedBooking, setSelectedBooking] = useState<string | null>(defBooking)
            const [mode, setMode] = useQueryState<'new' | 'existing'>('mode', {
                defaultValue: 'existing', parse(value) {
                    return value === 'new' ? 'new' : 'existing'
                },
            })

            function toggleSelect(id: string) {
                if (selection.has(id)) {
                    selection.delete(id)
                } else {
                    selection.add(id)
                }
                setSelection(new Set(selection))
            }

            const { mutateAsync: deployTo } = api.deploy.deployTo.useMutation()
            const { mutateAsync: returnAssets } = api.deploy.return.useMutation()
            const { mutateAsync: directDeploy } = api.deploy.directDeploy.useMutation()

            async function handleDeployTo(bookingId: string) {
                await deployTo({
                    bookingId,
                    assets: Array.from(selection)
                })
                setSelection(new Set())
                setSelectedBooking(null)
                void refetchBookings()
                void refetchTypes()
            }

            async function handlerReturn() {
                await returnAssets({
                    assets: Array.from(selection)
                })
                setSelection(new Set())
                void refetchBookings()
                void refetchTypes()
            }

            async function fastDeploy() {
                if (!fromTimeId || !toTimeId || !user) return
                await directDeploy({
                    assets: Array.from(selection),
                    timeFrom: fromTimeId,
                    timeTo: toTimeId,
                    userId: user,
                })
                setSelection(new Set())
                void refetchBookings()
                void refetchTypes()
            }

            return <DashboardLayout
                row={namespaceRow(namespace.slug)}
                titleHref={`/${namespace.slug}`}
                title="Entregar y devolver"
            >
                <div className="grid md:grid-cols-2 gap-2">
                    <div className="grid gap-2 mb-auto">
                        {assetTypes?.map(assetType => {
                            return <div key={assetType.id}>
                                <div className="flex justify-between">
                                    <Label>{assetType.name}</Label>
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1">

                                    {assetType.assets?.map(asset => {
                                        const pic = asset.picture || assetType.picture
                                        return <div key={asset.id} className={classNames("shadow-md rounded-md flex items-center cursor-pointer border relative p-1", {
                                            ' border-blue-500': selection.has(asset.id),
                                            ' border-transparent': !selection.has(asset.id)
                                        })} onClick={() => toggleSelect(asset.id)}>
                                            {pic && <Image src={pic} height={40} width={40} alt="Icono" className="p-1 mr-[-8px]" />}
                                            <div className="px-1">
                                                {asset.name}
                                            </div>
                                            {asset.inUseAsset && <p className="text-xs font-semibold text-blue-500 absolute bottom-[1px] left-0 right-0 text-center">{asset.inUseAsset.booking.user.user?.name}</p>}
                                        </div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="mb-auto">
                        <Label>Entregar a</Label>
                        <Switch
                            value={mode === 'new'}
                            onChange={value => void setMode(value ? 'new' : 'existing')}
                            offLabel="Elegir"
                            onLabel="Nuevo"
                        />
                        {mode === 'existing' && <div className="grid gap-1 mt-2">
                            {bookings?.map(booking => {

                                return <div key={booking.id} className={classNames("p-1 shadow-md cursor-pointer rounded-md", {
                                    'border border-blue-500 ring': booking.id === selectedBooking,
                                    'border border-transparent': booking.id !== selectedBooking,
                                })}
                                    onClick={() => setSelectedBooking(booking.id === selectedBooking ? null : booking.id)}
                                >
                                    <p>{booking.user.user?.name || ''}</p>
                                    <p className="text-sm">{booking.useType}</p>
                                    <p className="text-sm font-semibold text-blue-500">{booking.from.time.hours}:{booking.from.time.minutes} - {booking.to.time.hours}:{booking.to.time.minutes}</p>
                                    <div>
                                        <BookingAssetIndicator
                                            inUse={booking.inUseAssets}
                                            equipment={booking.equipment}
                                        />
                                    </div>
                                    <p className="text-sm">{booking.comment}</p>
                                </div>
                            })}
                        </div>}
                        {mode === 'new' && <div className="mt-2">
                            <ComboBox
                                label="Usuario"
                                value={user}
                                options={users?.map(user => ({
                                    label: user.name,
                                    value: user.id
                                })) || []}
                                onChange={value => setUser(value)}
                            />
                            <div className="grid grid-cols-2 gap-1 mt-1 mb-1">
                                <div>
                                    <Label>Desde (hoy)</Label>
                                    <ElegibleTimePicker
                                        onChange={t => setFromTimeId(t.id)}
                                        value={{ id: fromTimeId || '' }}
                                    />
                                </div>
                                <div>
                                    <Label>hasta (hoy)</Label>
                                    <ElegibleTimePicker
                                        onChange={t => setToTimeId(t.id)}
                                        value={{ id: toTimeId || '' }}
                                    />
                                </div>
                            </div>
                            <Button className="w-full mt-1" onClick={() => void fastDeploy()}>Crear y entregar</Button>
                        </div>}
                        <div className="mt-2">
                            {selectedBooking && <Button className="w-full mt-2" onClick={() => void handleDeployTo(selectedBooking)}>Entregar</Button>}
                            {selection.size > 0 && <Button variant="outlined" className="w-full mt-2" onClick={() => void handlerReturn()}>Devolver</Button>}
                        </div>
                    </div>
                </div>

            </DashboardLayout>
        }}
    </NamespaceAdminRoute>
}