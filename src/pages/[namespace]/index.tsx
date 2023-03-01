import DashboardNamespaceRoute from "../../lib/layouts/DashboardNamespaceRoute";
import TopRightActions from "../../lib/components/TopRightActions";
import { useRouter } from "next/router";

export default function DashboardOverview() {

    return <DashboardNamespaceRoute>
        {function Render({ namespace }) {
            const router = useRouter()
            return <>
                <TopRightActions actions={[{
                    label: "Nuevo pedido", onClick: () => {
                        void router.push(`/${namespace.slug}/bookings/new`)
                    }
                }]} />
            </>
        }}

    </DashboardNamespaceRoute>
}
