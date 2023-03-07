import { useRouter } from "next/router";
import BookingForm from "../../../lib/components/bookingForm";
import DashboardLayout from "../../../lib/layouts/Dashboard";
import { useNamespaceSlug } from "../../../utils/hooks";


export default function DashboardNewBooking() {
    const namespaceSlug = useNamespaceSlug()
    const router = useRouter()

    return <DashboardLayout
        title="Nuevo pedido"
        titleHref={`/${namespaceSlug}/bookings`}
    >
        <BookingForm
            onSave={(booking) => {
                void router.push(`/${namespaceSlug}/bookings/${booking.id}`)
            }}
        />
    </DashboardLayout>
}