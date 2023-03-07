import classNames from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import Button from "../../../lib/components/Button";
import Label from "../../../lib/components/Label";
import Switch from "../../../lib/components/Switch";
import DashboardLayout from "../../../lib/layouts/Dashboard";
import NamespaceAdminRoute from "../../../lib/layouts/NamespaceAdminRoute";
import { api } from "../../../utils/api";

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
            const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

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

            return <DashboardLayout
                titleHref={`/${namespace.slug}`}
                title="Entregar y devolver"
            >
                <div className="grid md:grid-cols-2 gap-2">
                    <div className="grid gap-2">
                        {assetTypes?.map(assetType => {
                            return <div key={assetType.id}>
                                <div className="flex justify-between">
                                    <Label>{assetType.name}</Label>
                                    {selection.size > 0 && <p className="text-blue-500 text-sm font-semibold cursor-pointer" onClick={() => void handlerReturn()}>Devolver seleccionados</p>}
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1">

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
                    <div>
                        <Label>Entregar a</Label>
                        <Switch offLabel="Elegir" onLabel="Nuevo" />
                        <div className="grid gap-1 mt-2">
                            {bookings?.map(booking => {

                                return <div key={booking.id} className={classNames("p-1 shadow-md cursor-pointer rounded-md", {
                                    'border border-blue-500 ring': booking.id === selectedBooking,
                                    'border border-transparent': booking.id !== selectedBooking,
                                })}
                                    onClick={() => setSelectedBooking(booking.id === selectedBooking ? null : booking.id)}
                                >
                                    <p>{booking.user.user?.name || ''}</p>
                                    <p className="text-sm font-semibold text-blue-500">{booking.from.time.hours}:{booking.from.time.minutes} - {booking.to.time.hours}:{booking.to.time.minutes}</p>
                                    <div>
                                        {booking.equipment.map(equipment => {
                                            return <p key={equipment.id} className="text-sm font-semibold">
                                                {equipment.assetType.name}: {equipment.quantity}
                                            </p>
                                        })}
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className="mt-2">
                            {selectedBooking && <Button className="w-full" onClick={() => void handleDeployTo(selectedBooking)}>Entregar</Button>}
                        </div>
                    </div>
                </div>

            </DashboardLayout>
        }}
    </NamespaceAdminRoute>
}