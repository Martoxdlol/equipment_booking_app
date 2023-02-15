import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout, { RowLink } from "../../lib/components/DashboardLayout";
import { useNamespace } from "../../lib/components/NamespaceProvider";
import namespaceRow from "../../lib/util/namespaceRow";
import { useNamespaceSlug } from "../../utils/hooks";

export default function DashboardOverview() {

    const namespace = useNamespace()
    const namespaceSlug = useNamespaceSlug()
    // const session = useSession()

    console.log(namespace)

    return <DashboardLayout
        title={namespace?.name}
        row={namespaceRow(namespaceSlug)}

    >
        <div className="mb-4 flex flex-row justify-between">
            <div className="space-y-sm pr-4"></div>
            <div className="mt-2 hidden md:mt-0 md:flex">
                <button type="button" className="box-border relative inline-flex items-center justify-center text-center no-underline leading-none whitespace-nowrap font-semibold rounded shrink-0 transition select-none overflow-hidden focus-ring hover:bg-secondary text-primary border border-secondary bg-primary h-4 py-1.5 px-2">Connect</button>
                <div className="ml-2">
                    <Link href={`/${namespaceSlug}/bookings/new`} type="button" className="box-border relative inline-flex items-center justify-center text-center no-underline leading-none whitespace-nowrap font-semibold rounded shrink-0 transition select-none overflow-hidden focus-ring bg-gray-800 hover:bg-gray-900 dark:bg-gray-50 border border-transparent text-gray-50 dark:text-gray-800 dark:hover:bg-white dark:hover:text-gray-900 cursor-pointer hover:text-white h-4 py-1.5 px-2">
                        Nuevo pedido
                    </Link>
                </div>

            </div>
        </div>

    </DashboardLayout>
}
