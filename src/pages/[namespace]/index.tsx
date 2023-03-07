import DashboardNamespaceRoute from "../../lib/layouts/DashboardNamespaceRoute";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIsAdmin } from "../../utils/hooks";

export default function DashboardOverview() {

    const isAdmin = useIsAdmin()

    return <DashboardNamespaceRoute
        isAdmin={isAdmin}
    >
        {function Render({ namespace }) {
            return <>

                <h1 className="text-lg font-semibold mb-2">Destacado</h1>

                <Link href={`/${namespace.slug}/bookings`} className="block rounded-md px-3 py-2 gradient text-white mb-5 mt-3 shadow-lg">
                    <h2 className="text-xl">{isAdmin ? "Pedidos" : "Mis pedidos"}</h2>
                    <p>{isAdmin ? "Ver todos los pedidos" : "Ver mis reservas de equipamiento"}</p>
                </Link>
                <Link href={`/${namespace.slug}/bookings/new`} className="block rounded-md px-3 py-2 gradient-2 text-white mb-5 mt-3 shadow-lg">
                    <h2 className="text-xl">Nuevo pedido</h2>
                    <p>Reservar equipamiento</p>
                </Link>
                {isAdmin && <Link href={`/${namespace.slug}/deploy`} className="block rounded-md px-3 py-2 gradient-3 text-white mb-5 shadow-lg">
                    <h2 className="text-xl">Entregar o devolver</h2>
                    <p>Entregar o devolver equipamiento disponible</p>
                </Link>}
                {isAdmin && <Link href={`/${namespace.slug}/equipment`} className="block rounded-md px-3 py-2 gradient-3 text-white mb-5 shadow-lg">
                    <h2 className="text-xl">Equipamiento</h2>
                    <p>Ver equipamiento disponible</p>
                </Link>}
            </>
        }}

    </DashboardNamespaceRoute>
}
