import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../../../lib/components/Button";
import DashboardLayout, { RowLink } from "../../../lib/components/DashboardLayout";
import { useNamespace } from "../../../lib/components/NamespaceProvider";
import namespaceRow from "../../../lib/util/namespaceRow";
import { api } from "../../../utils/api";
import { useNamespaceSlug } from "../../../utils/hooks";

export default function DashboardOverview() {

    const namespace = useNamespace()
    const namespaceSlug = useNamespaceSlug()
    // const session = useSession()
    const router = useRouter()

    const { data: types } = api.assetType.getAllDetailed.useQuery()

    return <DashboardLayout
        title={namespace?.name}
        row={namespaceRow(namespaceSlug)}
    >

        <div className="relative w.full h-1">
            <div className="absolute top-0 right-0">
                <Button onClick={() => void router.push(`/${namespaceSlug}/equipment/new`)}>Nuevo tipo</Button>
            </div>
        </div>

        <h1 className="text-lg font-semibold mb-2">Tipos de equipamiento</h1>
        <div className="grid md:grid-cols-2 gap-2">
            {types?.map(type => <Link key={type.id} className="rounded-md shadow border px-4 py-2" href={`/${namespaceSlug}/equipment/${type.slug}`}>
                <h2 className="font-semibold mb-1">{type.name}</h2>

                {/* <div>
                    <div>Cantidad <b>{type.assets.length}</b></div>
                    <div>Pedidos <b>{type.equipmentBookingItems.length}</b></div>
                </div> */}
            </Link>
            )}
        </div>
    </DashboardLayout>
}
