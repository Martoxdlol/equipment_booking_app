import BookingForm from "../../../lib/components/bookingForm";
import DashboardLayout from "../../../lib/layouts/Dashboard";
import { useNamespaceSlug } from "../../../utils/hooks";


export default function DashboardNewBooking() {
    const namespaceSlug = useNamespaceSlug()

    return <DashboardLayout
        title="Nuevo pedido"
        titleHref={`/${namespaceSlug}/bookings`}
    >
        <BookingForm
            onSave={(booking) => {
                console.log(booking);
            }}
        />
    </DashboardLayout>
}