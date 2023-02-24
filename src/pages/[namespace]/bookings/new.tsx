import DashboardLayout from "../../../lib/components/DashboardLayout";
import BookingForm from "../../../lib/components/bookingForm";


export default function DashboardNewBooking() {
    return <DashboardLayout
        title="Nuevo pedido"
    >
        <BookingForm 
            onSave={(booking) => {
                console.log(booking);
            }}
        />
    </DashboardLayout>
}