import classNames from "classnames"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import BookingAssetIndicator from "../../../../lib/components/BookingAssetIndicator"
import Button from "../../../../lib/components/Button"
import Input from "../../../../lib/components/Input"
import Label from "../../../../lib/components/Label"
import DashboardLayout from "../../../../lib/layouts/Dashboard"
import LoadingFullPage from "../../../../lib/layouts/LoadingFullPage"
import NotFoundFullPage from "../../../../lib/layouts/NotFoundFullPage"
import { api } from "../../../../utils/api"
import { useNamespaceSlug } from "../../../../utils/hooks"

export default function BookingView() {
    const router = useRouter()
    const bookingId = router.query.bookingId?.toString() || ''
    const namespaceSlug = useNamespaceSlug()
    const { data: booking, isInitialLoading } = api.bookings.get.useQuery(bookingId || '', { enabled: !!bookingId })

    const isOk = router.query.ok === 'true'

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

    let from = dayjs().startOf('day')
    from = from.set('year', booking.from.date.year)
    from = from.set('month', booking.from.date.month - 1)
    from = from.set('day', booking.from.date.day)
    from = from.set('hour', booking.from.time.hours)
    from = from.set('minute', booking.from.time.minutes)
    from = from.set('second', 0)

    let to = dayjs().startOf('day')
    to = to.set('year', booking.to.date.year)
    to = to.set('month', booking.to.date.month - 1)
    to = to.set('day', booking.to.date.day)
    to = to.set('hour', booking.to.time.hours)
    to = to.set('minute', booking.to.time.minutes)
    to = to.set('second', 0)

    const requestedBy: string = booking.user?.user?.name || ''
    const requestedByEmail = booking.user?.user?.email

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
        <div className="grid md:grid-cols-2 gap-2">
            <div className="grid sm:grid-cols-2 gap-2">
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
                <Button className="mt-2" onClick={() => {
                    void router.push({
                        hostname: `/${namespaceSlug}/deploy`,
                        query: {
                            booking: booking.id
                        }
                    })
                }}>Entregar o devolver equipos</Button>
            </div>
        </div>



    </DashboardLayout>
}