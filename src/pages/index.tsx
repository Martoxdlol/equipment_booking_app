import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import TopRightActions from "../lib/components/TopRightActions";
import AuthedRoute from "../lib/layouts/AuthedRoute";
import DashboardLayout from "../lib/layouts/Dashboard";
import { api } from "../utils/api";

export default function UserPage() {
    const { data: session } = useSession();

    const { data: namespaces } = api.namespaces.useQuery()

    const router = useRouter()

    useEffect(() => {
        if (namespaces?.length === 1 && namespaces[0]) {
            window.location.href = `/${namespaces[0].slug}`
        }
    }, [namespaces, router])

    return <AuthedRoute>
        <DashboardLayout
            title={session?.user?.name || "Mi perfil"}
            row={[
                {
                    label: "Inicio",
                    href: "/",
                },
                {
                    label: "Mi perfil",
                    href: "/me",
                },
            ]}
        >
            {namespaces?.map((namespace, i) => {
                return <a key={namespace.slug} href={`/${namespace.slug}`} className={`flex rounded-md px-3 py-2 gradient-${(i % 3) + 1} text-white mb-5 mt-3 shadow-lg`}>
                    {namespace.picture && <Image 
                        alt="Logo"
                        height={30}
                        width={30}
                        src={namespace.picture}
                        className="mr-2"
                    />}
                    <h2 className="text-xl">{namespace.name}</h2>
                </a>
            })}


        </DashboardLayout>
    </AuthedRoute >
}