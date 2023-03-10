import { useRouter } from "next/router";
import BookingForm from "../../../../lib/components/bookingForm";
import NotFoundFullPage from "../../../../lib/layouts/NotFoundFullPage";
import { api } from "../../../../utils/api";
import LoadingFullPage from "../../../../lib/layouts/LoadingFullPage";
import DashboardLayout from "../../../../lib/layouts/Dashboard";
import namespaceRow from "../../../../lib/util/namespaceRow";
import { useNamespaceSlug } from "../../../../utils/hooks";


export default function DashboardNewBooking() {
    const router = useRouter()
    const bookingId = router.query.bookingId?.toString() || ''
    const namespaceSlug = useNamespaceSlug()

    const { data: booking, isInitialLoading } = api.bookings.get.useQuery(bookingId || '', { enabled: !!bookingId })

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

    return <DashboardLayout
        title="Modificar pedido"
        row={namespaceRow(namespaceSlug || '-')}
    >
        <BookingForm
            booking={booking}
            onSave={(booking) => {
                void router.push(`/${namespaceSlug}/bookings/${booking.id}?updated=true`)
            }}
        />
    </DashboardLayout>
}