import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../../../lib/components/Button";
import { api } from "../../../utils/api";
import DashboardNamespaceRoute from "../../../lib/layouts/DashboardNamespaceRoute";
import Image from "next/image";
import { useIsAdmin } from "../../../utils/hooks";

export default function DashboardOverview() {
    const { data: types } = api.assetType.getAllDetailed.useQuery()
    const isAdmin = useIsAdmin()

    return <DashboardNamespaceRoute
        isAdmin={isAdmin}
    >

        {function Render({ namespace }) {
            const router = useRouter()

            return <>
                <div className="relative w.full h-1">
                    <div className="absolute top-0 right-0">
                        <Button onClick={() => void router.push(`/${namespace.slug}/equipment/new`)}>Nuevo tipo</Button>
                    </div>
                </div>

                <h1 className="text-lg font-semibold mb-2">Tipos de equipamiento</h1>
                <div className="grid md:grid-cols-2 gap-2">
                    {types?.map(type => <Link key={type.id} className="rounded-md shadow border px-4 py-2 flex items-center" href={`/${namespace.slug}/equipment/${type.slug}`}>
                        {type.picture && <Image src={type.picture} alt="Logo" height={30} width={30} className="ml-[-16px]" />}
                        <h2 className="font-semibold mb-1 ml-2">{type.name}</h2>

                        {/* <div>
                    <div>Cantidad <b>{type.assets.length}</b></div>
                    <div>Pedidos <b>{type.equipmentBookingItems.length}</b></div>
                </div> */}
                    </Link>
                    )}
                </div>
            </>
        }}
    </DashboardNamespaceRoute>
}
