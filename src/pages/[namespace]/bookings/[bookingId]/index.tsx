import classNames from "classnames"
import dayjs from "dayjs"
import Link from "next/link"
import { useRouter } from "next/router"
import BookingAssetIndicator from "../../../../lib/components/BookingAssetIndicator"
import Button from "../../../../lib/components/Button"
import Input from "../../../../lib/components/Input"
import Label from "../../../../lib/components/Label"
import DashboardLayout from "../../../../lib/layouts/Dashboard"
import LoadingFullPage from "../../../../lib/layouts/LoadingFullPage"
import NotFoundFullPage from "../../../../lib/layouts/NotFoundFullPage"
import { type Unpacked, api } from "../../../../utils/api"
import { useIsAdmin, useNamespaceSlug } from "../../../../utils/hooks"
import { nameOf } from "../../../../utils/names"
import { useMemo } from "react"

export default function BookingView() {
    const router = useRouter()
    const bookingId = router.query.bookingId?.toString() || ''
    const namespaceSlug = useNamespaceSlug()
    const { data: booking, isInitialLoading } = api.bookings.get.useQuery(bookingId || '', { enabled: !!bookingId })

    const isOk = router.query.ok === 'true'
    const isUpdated = router.query.updated === 'true'

    const isAdmin = useIsAdmin()

    type BookingType = NonNullable<typeof booking>

    const events = useMemo<BookingType['events']>(() => {
        const eventsByAssetId = new Map<string, Unpacked<BookingType['events']>>();
        const list: BookingType['events'] = []
        if (!booking) return list
        for (const event of booking.events) {
            const prev = eventsByAssetId.get(event.assetId)
            if (prev && dayjs((prev.returnedAt ?? prev.deployedAt).toString()).isBefore(dayjs())) continue;
            eventsByAssetId.set(event.assetId, event)
        }

        for (const [,event] of eventsByAssetId) {
            list.push(event)
        }
        return list
    }, [booking])

    if (!bookingId) {
        return <NotFoundFullPage />
    }

    if (isInitialLoading) {
        return <LoadingFullPage />
    }

    if (!booking && !isInitialLoading) {
        return <NotFoundFullPage />
    }

    if (!booking) {
        return <NotFoundFullPage />
    }

    const from = dayjs().startOf('day').set('date', booking.from.date.day).set('month', booking.from.date.month - 1).set('year', booking.from.date.year).set('hour', booking.from.time.hours).set('minute', booking.from.time.minutes)

    const to = dayjs().startOf('day').set('date', booking.to.date.day).set('month', booking.to.date.month - 1).set('year', booking.to.date.year).set('hour', booking.to.time.hours).set('minute', booking.to.time.minutes)


    const requestedBy: string = nameOf(booking.user)
    const requestedByEmail = booking.user?.user?.email

    const createdAtFormattedLC = dayjs(booking.createdAt.toString()).format('dddd DD [de] MMMM YYYY - HH:mm')

    const createdAtFormatted = (createdAtFormattedLC[0]?.toUpperCase() || '') + createdAtFormattedLC.substring(1)

    return <DashboardLayout
        titleHref={`/${namespaceSlug}/bookings`}
        title={`Pedido de ${requestedBy}`}
        row={[{
            label: 'Mis Pedidos',
            href: `/${namespaceSlug}/bookings`
        }]}
    >
        {isOk && <p className="text-lg mb-1 py-1 text-center border-2 border-green-500 text-green-500 rounded-md">
            Tu pedido se registró correctamente
        </p>}
        {isUpdated && <p className="text-lg mb-1 py-1 text-center border-2 border-green-500 text-green-500 rounded-md">
            Tu pedido se actualizó correctamente
        </p>}
        <div className="grid md:grid-cols-2 gap-2">
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
                <div>
                    <Label>Pedido por</Label>
                    <Input value={requestedBy + (requestedByEmail ? ` <${requestedByEmail}>` : '')} />
                </div>
                <div>
                    <Label>Uso</Label>
                    <Input value={booking.useType} />
                </div>
                <div>
                    <Label>Desde</Label>
                    <Input value={from.format('DD/MM/YYYY HH:mm')} />
                </div>
                <div>
                    <Label>Hasta</Label>
                    <Input value={to.format('DD/MM/YYYY HH:mm')} />
                </div>
                <div className="col-span-2">
                    <Label>Comentario</Label>
                    <Input value={booking.comment} />
                </div>
                <div className="col-span-2">
                    <Label>Creado</Label>
                    <Input value={createdAtFormatted} />
                </div>
                <div className="col-span-2 flex gap-1">
                    <Button
                        onClick={() => {
                            void router.push(`/${namespaceSlug}/bookings/${booking.id}/change`)
                        }}
                    >Editar</Button>
                </div>
                {booking.pool && <div className="col-span-2">
                    <Label>Fechas (pedido recurrente)</Label>
                    <div className="repeat-grid gap-1">
                        {booking.pool.bookings.map((localBooking) => {
                            return <Link href={`/${namespaceSlug}/bookings/${localBooking.id}`} key={localBooking.id} className={classNames("border rounded-md py-0.5 px-2 flex items-center", {
                                'border-blue-500': localBooking.id === booking.id
                            })}>
                                <p className="py-1 px-1 w-full">
                                    {localBooking.from.date.day}/
                                    {localBooking.from.date.month}/
                                    {localBooking.from.date.year}
                                </p>
                            </Link>
                        })}
                    </div>
                </div>}
            </div>
            <div>
                <Label>Equipamiento</Label>
                <BookingAssetIndicator equipment={booking.equipment} inUse={booking.inUseAssets} />
                <Label>Equipos utilizados</Label>
                {events.map(event => {

                    return <div key={event.id}>
                        {event.asset.tag} {event.returnedAt ?
                            <span className="font-semibold text-green-600">DEVUELTO</span>
                            :
                            <span className="font-semibold text-yellow-600">PENDIENTE</span>}
                    </div>
                })}
                {isAdmin && <>
                    <Button className="mt-2" onClick={() => {
                        void router.push({
                            hostname: `/${namespaceSlug}/deploy`,
                            query: {
                                booking: booking.id
                            }
                        })
                    }}>Entregar o devolver equipos</Button>
                </>}
            </div>
        </div>
    </DashboardLayout>
}