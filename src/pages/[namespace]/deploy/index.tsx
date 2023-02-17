import DashboardLayout from "../../../lib/components/DashboardLayout";
import NamespaceAdminRoute from "../../../lib/layouts/NamespaceAdminRoute";

export default function DashboardDeploy() {
    return <NamespaceAdminRoute>
        {function Render({ namespace }) {

            return <DashboardLayout>
                <h1 className="font-semibold text-xl">Deploy</h1>

            </DashboardLayout>
        }}
    </NamespaceAdminRoute>
}