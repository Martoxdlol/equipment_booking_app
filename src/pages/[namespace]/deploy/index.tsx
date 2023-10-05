import classNames from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { useId, useLayoutEffect, useState } from "react";
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
import { nameOf } from "../../../utils/names";
import { stringToColor } from "../../../lib/util/colors";
import { HomeIcon, Undo2Icon, ForwardIcon, EraserIcon, XIcon } from "lucide-react";
import Link from "next/link";

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
            const [_selectedBooking, setSelectedBooking] = useState<string | null>(defBooking)
            const [expanded, setExpanded] = useState(false)

            const expandedWrapperId = useId()
            const expandedId = useId()

            useLayoutEffect(() => {
                if (expanded) {
                    document.getElementById(expandedId)?.animate([
                        { transform: 'translateY(100%)' },
                        { transform: 'translateY(0)' },
                    ], {
                        duration: 200,
                        easing: 'ease-in-out',
                    })
                } else {
                    // document.getElementById(expandedId)?.animate([
                    //     { transform: 'translateY(0)', position: 'fixed', bottom: 0, width: '100%', background: 'white' },
                    //     { transform: 'translateY(80%)', position: 'fixed', bottom: 0, width: '100%',background: 'white' },
                    // ], {
                    //     duration: 2000,
                    //     easing: 'ease-in-out',
                    // })
                }


            }, [expanded])


            let selectedBooking = _selectedBooking

            if (bookings?.filter(b => b.userId == user || !user).length === 0) {
                selectedBooking = 'new'
            }

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


            let deployButtonEnabled = selection.size > 0 && selectedBooking
            if (deployButtonEnabled && selectedBooking === 'new') {
                deployButtonEnabled = fromTimeId && toTimeId && user
            }

            let deployToName = ''

            if (selectedBooking === 'new') {
                const u = users?.find(u => u.id === user)
                deployToName = u ? nameOf(users?.find(u => u.id === user)) : ''
            } else if (selectedBooking) {
                const b = bookings?.find(b => b.id === selectedBooking)
                deployToName = b ? nameOf(b.user) : ''
            }

            const returnButton = <Button
                disabled={selection.size === 0}
                onClick={() => {
                    if (selection.size === 0) return
                    void handlerReturn().then(() => setExpanded(false))
                }}
            >
                <Undo2Icon /><span className="p-1">Devolver</span>
            </Button>


            const deployButton = <Button
                disabled={!deployButtonEnabled}
                onClick={() => {
                    if (!selectedBooking) return
                    if (selection.size === 0) return
                    if (selectedBooking === 'new') {
                        void fastDeploy().then(() => setExpanded(false))
                    } else {
                        void handleDeployTo(selectedBooking).then(() => setExpanded(false))
                    }
                }}
            >
                <span className="p-1">Entregar</span>
                <ForwardIcon />
            </Button>

            const mobileExpandButton = <Button
                onClick={() => setExpanded(true)}
                disabled={selection.size === 0}
            >
                <span className="p-1">Siguiente</span>
                <ForwardIcon />
            </Button>

            return <div className="fixed w-full h-full">
                <div className="grid grid-rows-[50px_1fr_50px] lg:grid-cols-[1fr_400px] lg:grid-rows-none h-full">
                    <header className="lg:col-span-2">
                        <nav className="border-b flex">
                            <Link className="h-[50px] w-[50px] flex items-center justify-center" href={`/${namespace.slug}`}>
                                <HomeIcon />
                            </Link>
                            <div className="m-auto">

                            </div>
                            <button className="h-[50px] w-[50px] flex items-center justify-center"
                                onClick={() => {
                                    setSelection(new Set())
                                    setSelectedBooking(null)
                                }}
                            >
                                <EraserIcon />
                            </button>
                        </nav>
                    </header>
                    <section
                        className="overflow-auto w-full"
                    >
                        <div
                            tabIndex={0}
                            onKeyDown={e => {
                                if (e.key === 'Escape') {
                                    setSelection(new Set())
                                }
                            }}
                        >
                            {assetTypes?.map((assetType, index1) => {
                                return <div key={assetType.id} className="py-1 lg:p-1">
                                    <h2 className="p-[2px] lg:px-0 font-medium">{assetType.name}</h2>
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[1px]" id={`grid-${index1}`}>
                                        {assetType.assets?.map((asset, index2) => {

                                            return <button
                                                onKeyDown={e => {
                                                    const gridWidth = document.getElementById(`grid-${index1}`)?.getBoundingClientRect().width ?? 0

                                                    const columns = ((gridWidth + 1) / (150 + 1))

                                                    if (e.key === 'ArrowRight') {
                                                        document.getElementById(`asset-${index1}-${index2 + 1}`)?.focus()
                                                    }
                                                    if (e.key === 'ArrowLeft') {
                                                        document.getElementById(`asset-${index1}-${index2 - 1}`)?.focus()
                                                    }
                                                    if (e.key === 'ArrowDown') {
                                                        document.getElementById(`asset-${index1 + 1}-0`)?.focus()
                                                    }
                                                    if (e.key === 'ArrowUp') {
                                                        document.getElementById(`asset-${index1 - 1}-${(assetTypes[index1 - 1]?.assets?.length ?? 0) - 1}`)?.focus()
                                                    }
                                                }}
                                                id={`asset-${index1}-${index2}`}
                                                key={asset.id}
                                                className={classNames('relative ring-[1px] border-gray-300 py-2 text-center font-medium border-2 border-transparent border-dashed',
                                                    'focus:border-black focus:outline-none', {
                                                    'bg-blue-500 text-white ring-blue-500': selection.has(asset.id) && asset.enabled,
                                                    'ring-gray-300': !selection.has(asset.id),
                                                    'text-gray-400': !asset.enabled,
                                                    'bg-blue-200 ring-blue-200': !asset.enabled && selection.has(asset.id),
                                                })}
                                                onClick={() => toggleSelect(asset.id)}
                                            >
                                                <p>{asset.name}</p>
                                                {asset.inUseAsset && <p className="text-xs font-semibold text-blue-500 absolute bottom-[1px] left-0 right-0 text-center"
                                                    style={{ color: stringToColor(nameOf(asset.inUseAsset.booking.user)) }}
                                                >{nameOf(asset.inUseAsset.booking.user)}</p>}
                                            </button>
                                        })}
                                    </div>
                                </div>
                            })}
                        </div>
                    </section>
                    <section className={classNames("border-t lg:border-none overflow-auto", {
                        'fixed bg-stone-700 bg-opacity-25 w-full bottom-0 h-full': expanded,
                    })}
                        onClick={() => setExpanded(false)}
                        id={expandedWrapperId}
                    >
                        <div
                            id={expandedId}
                            tabIndex={0}
                            onClick={e => e.stopPropagation()}
                            className={classNames({
                                'fixed bottom-0 w-full h-[80%] shadow-[0_0_10px_10px_rgba(0,0,0,0.1)]': expanded,
                                'bg-white overflow-auto': expanded
                            })}
                        >
                            <div className="hidden p-1 lg:grid grid-cols-2 gap-1">
                                {returnButton}
                                {deployButton}
                            </div>
                            {!expanded && <div className="grid lg:hidden p-1 grid-cols-2 gap-1">
                                {returnButton}
                                {mobileExpandButton}
                            </div>}
                            {expanded && <div className="grid lg:hidden p-1 grid-cols-2 gap-1 fixed bottom-0 z-10 w-full bg-white border-t">
                                {returnButton}
                                {deployButton}
                            </div>}
                            {expanded && <div className="fixed w-full border-b h-[40px] bg-white z-10 flex items-center px-1">
                                <h2 className="mr-auto font-medium">Entregar a {deployToName}</h2>
                                <button onClick={() => setExpanded(false)}>
                                    <XIcon />
                                </button>
                            </div>}
                            {expanded && <div className="h-[41px]" />}
                            <div className="p-1">
                                <ComboBox
                                    reseteable
                                    label="Usuario"
                                    value={user}
                                    options={users?.map(user => ({
                                        label: nameOf(user),
                                        value: user.id
                                    })) || []}
                                    onChange={value => setUser(value)}
                                />
                            </div>

                            <div className="p-1">
                                <div className={classNames("p-1 shadow-md cursor-pointer rounded-md relative", {
                                    'border border-blue-500 ring': 'new' === selectedBooking,
                                    'border border-transparent': 'new' !== selectedBooking,
                                })}
                                    onClick={() => setSelectedBooking('new' === selectedBooking ? null : 'new')}
                                >
                                    <h2 className="font-medium">Crear y entregar (D)</h2>
                                    <div className="grid grid-cols-2 gap-1 mt-1 mb-1">
                                        <div onClick={e => e.stopPropagation()}>
                                            <Label>Desde (hoy)</Label>
                                            <ElegibleTimePicker
                                                onChange={t => setFromTimeId(t.id)}
                                                value={{ id: fromTimeId || '' }}
                                            />
                                        </div>
                                        <div onClick={e => e.stopPropagation()}>
                                            <Label>hasta (hoy)</Label>
                                            <ElegibleTimePicker
                                                onChange={t => setToTimeId(t.id)}
                                                value={{ id: toTimeId || '' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="p-1">
                                {bookings?.filter(b => b.userId == user || !user).map(booking => {

                                    return <div key={booking.id} className={classNames("p-1 cursor-pointer rounded-md relative", {
                                        'border border-blue-500 ring': booking.id === selectedBooking,
                                        'border border-transparent': booking.id !== selectedBooking,
                                    })}
                                        onClick={() => setSelectedBooking(booking.id === selectedBooking ? null : booking.id)}
                                        tabIndex={0}
                                        onKeyDown={e => {
                                            if (e.key === 'Escape') {
                                                setSelectedBooking(null)
                                            }
                                        }}
                                    >

                                        <div
                                            onClick={e => {
                                                e.stopPropagation()
                                            }}
                                            className="absolute top-[3px] right-[4px] h-[12px] w-[24px] rounded-full bg-blue-500 flex justify-around cursor-pointer"
                                            style={{ backgroundColor: stringToColor(booking.poolId ?? booking.userId) }}
                                        >
                                            {booking.poolId && <Image alt="icon" src="/link.svg" width={14} height={14} />}
                                        </div>


                                        <p style={{ color: stringToColor(nameOf(booking.user)) }} className="font-medium">{nameOf(booking.user)}</p>
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
                            </div>
                            {expanded && <div className="h-[50px]" />}
                        </div>

                    </section>
                </div>
            </div>

            // return <DashboardLayout
            //     row={namespaceRow(namespace.slug)}
            //     titleHref={`/${namespace.slug}`}
            //     title="Entregar y devolver"
            // >
            //     <div className="grid md:grid-cols-2 gap-2">
            //         <div className="grid gap-2 mb-auto">
            //             {assetTypes?.map(assetType => {
            //                 return <div key={assetType.id}>
            //                     <div className="flex justify-between">
            //                         <Label>{assetType.name}</Label>
            //                     </div>
            //                     <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1">

            //                         {assetType.assets?.map(asset => {
            //                             const pic = asset.picture || assetType.picture
            //                             return <div key={asset.id} className={classNames("shadow-md rounded-md flex items-center cursor-pointer border relative p-1", {
            //                                 'border-blue-500': selection.has(asset.id),
            //                                 'border-transparent': !selection.has(asset.id),
            //                                 'opacity-50': !asset.enabled
            //                             })} onClick={() => toggleSelect(asset.id)}>
            //                                 {pic && <Image src={pic} height={40} width={40} alt="Icono" className="p-1 mr-[-8px]" />}
            //                                 <div className="px-1">
            //                                     {asset.name}
            //                                 </div>
            //                                 {asset.inUseAsset && <p className="text-xs font-semibold text-blue-500 absolute bottom-[1px] left-0 right-0 text-center"
            //                                     style={{ color: stringToColor(nameOf(asset.inUseAsset.booking.user)) }}
            //                                 >{nameOf(asset.inUseAsset.booking.user)}</p>}
            //                             </div>
            //                         })}
            //                     </div>
            //                 </div>
            //             })}
            //         </div>
            //         <div className="mb-auto">
            //             {selection.size > 0 && <>
            //                 <Label>Selección</Label>
            //                 <Button variant="outlined" className="w-full mb-2 mt-1" onClick={() => void handlerReturn()}>Devolver</Button>
            //             </>}
            //             <Label>Entregar a</Label>
            //             <Switch
            //                 value={mode === 'new'}
            //                 onChange={value => void setMode(value ? 'new' : 'existing')}
            //                 offLabel="Elegir"
            //                 onLabel="Nuevo"
            //             />
            //             {mode === 'existing' && <div className="grid gap-1 mt-2">
            //                 {bookings?.map(booking => {

            //                     return <div key={booking.id} className={classNames("p-1 shadow-md cursor-pointer rounded-md relative", {
            //                         'border border-blue-500 ring': booking.id === selectedBooking,
            //                         'border border-transparent': booking.id !== selectedBooking,
            //                     })}
            //                         onClick={() => setSelectedBooking(booking.id === selectedBooking ? null : booking.id)}
            //                     >

            //                         <div
            //                             onClick={e => {
            //                                 e.stopPropagation()
            //                             }}
            //                             className="absolute top-[3px] right-[4px] h-[12px] w-[24px] rounded-full bg-blue-500 flex justify-around cursor-pointer"
            //                             style={{ backgroundColor: stringToColor(booking.poolId ?? booking.userId) }}
            //                         >
            //                             {booking.poolId && <Image alt="icon" src="/link.svg" width={14} height={14} />}
            //                         </div>


            //                         <p style={{ color: stringToColor(nameOf(booking.user)) }}>{nameOf(booking.user)}</p>
            //                         <p className="text-sm">{booking.useType}</p>
            //                         <p className="text-sm font-semibold text-blue-500">{booking.from.time.hours}:{booking.from.time.minutes} - {booking.to.time.hours}:{booking.to.time.minutes}</p>
            //                         <div>
            //                             <BookingAssetIndicator
            //                                 inUse={booking.inUseAssets}
            //                                 equipment={booking.equipment}
            //                             />
            //                         </div>
            //                         <p className="text-sm">{booking.comment}</p>
            //                     </div>
            //                 })}
            //             </div>}
            //             {mode === 'new' && <div className="mt-2">
            //                 <ComboBox
            //                     label="Usuario"
            //                     value={user}
            //                     options={users?.map(user => ({
            //                         label: nameOf(user),
            //                         value: user.id
            //                     })) || []}
            //                     onChange={value => setUser(value)}
            //                 />
            //                 <div className="grid grid-cols-2 gap-1 mt-1 mb-1">
            //                     <div>
            //                         <Label>Desde (hoy)</Label>
            //                         <ElegibleTimePicker
            //                             onChange={t => setFromTimeId(t.id)}
            //                             value={{ id: fromTimeId || '' }}
            //                         />
            //                     </div>
            //                     <div>
            //                         <Label>hasta (hoy)</Label>
            //                         <ElegibleTimePicker
            //                             onChange={t => setToTimeId(t.id)}
            //                             value={{ id: toTimeId || '' }}
            //                         />
            //                     </div>
            //                 </div>
            //                 <Button className="w-full mt-1" onClick={() => void fastDeploy()}>Crear y entregar</Button>
            //             </div>}
            //             <div className="mt-2">
            //                 {selectedBooking && <Button className="w-full mt-2" onClick={() => void handleDeployTo(selectedBooking)}>Entregar</Button>}
            //                 {selection.size > 0 && <Button variant="outlined" className="w-full mt-2" onClick={() => void handlerReturn()}>Devolver</Button>}
            //             </div>
            //         </div>
            //     </div>

            // </DashboardLayout>
        }}
    </NamespaceAdminRoute>
}