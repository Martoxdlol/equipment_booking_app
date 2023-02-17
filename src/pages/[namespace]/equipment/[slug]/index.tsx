import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../../../../lib/components/Button";
import DashboardLayout, { RowLink } from "../../../../lib/components/DashboardLayout";
import { useNamespace } from "../../../../lib/components/NamespaceProvider";
import namespaceRow from "../../../../lib/util/namespaceRow";
import { api } from "../../../../utils/api";
import { useNamespaceSlug } from "../../../../utils/hooks";

export default function DashboardOverview() {

    const namespace = useNamespace()
    const namespaceSlug = useNamespaceSlug()
    // const session = useSession()
    const router = useRouter()
    const slug = router.query.slug?.toString() || ''

    const { data: type } = api.assetType.getDetailed.useQuery(slug)

    return <DashboardLayout
        title={`Assets del tipo "${type?.name || ''}"`}
        row={namespaceRow(namespaceSlug)}
    >

        <div className="relative w.full h-1">
            <div className="absolute top-0 right-0 flex gap-1">
                <Button onClick={() => void router.push(`/${namespaceSlug}/equipment/${slug}/change`)} variant="outlined">Editar</Button>
                <Button onClick={() => void router.push(`/${namespaceSlug}/equipment/${slug}/new`)}>Nuevo</Button>
            </div>
        </div>

        <h1 className="text-lg font-semibold mb-2">Assets</h1>
        <div className="grid md:grid-cols-2 gap-2">
            {type?.assets.map(asset => <Link key={asset.id} className="rounded-md shadow border px-4 py-2" href={`/${namespaceSlug}/equipment/${type.slug}/asset/${asset.tag}`}>
                <h2 className="font-semibold mb-1">{asset.name}</h2>

                {/* <div>
                    <div>Cantidad <b>{type.assets.length}</b></div>
                    <div>Pedidos <b>{type.equipmentBookingItems.length}</b></div>
                </div> */}
            </Link>
            )}
        </div>
    </DashboardLayout>
}
