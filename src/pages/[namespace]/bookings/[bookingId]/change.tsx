import { useRouter } from "next/router";
import DashboardLayout from "../../../../lib/components/DashboardLayout";
import BookingForm from "../../../../lib/components/bookingForm";
import NotFoundFullPage from "../../../../lib/layouts/NotFoundFullPage";
import { api } from "../../../../utils/api";
import { useState } from "react";
import LoadingFullPage from "../../../../lib/layouts/LoadingFullPage";


export default function DashboardNewBooking() {
    const router = useRouter()
    const bookingId = router.query.bookingId?.toString() || ''

    const { data: booking, isInitialLoading } = api.bookings.get.useQuery(bookingId || '', { enabled: !!bookingId })

    if (!bookingId) {
        return <NotFoundFullPage />
    }

    if(isInitialLoading) {
        return <LoadingFullPage />
    }

    if (!booking && !isInitialLoading) {
        return <NotFoundFullPage />
    }

    if (!booking) {
        return <NotFoundFullPage />
    }

    return <DashboardLayout
        title="Nuevo pedido"
    >
        <BookingForm
            booking={booking}
            onSave={(booking) => {
                console.log(booking);
            }}
        />
    </DashboardLayout>
}