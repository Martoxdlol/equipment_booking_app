import DashboardLayout from "./Dashboard";

export default function NotFoundFullPage() {
    return <DashboardLayout>
        <p className="font-semibold text-lg text-gray-800">Error 404 - no se encontró la página</p>
    </DashboardLayout>
}