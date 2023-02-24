import DashboardLayout from "./Dashboard";

export default function ErrorFullPage() {
    return <DashboardLayout>
        <p className="font-semibold text-lg text-gray-800">Ocurrió un error. Vuelva a intentar.</p>
    </DashboardLayout>
}