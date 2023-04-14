import { signIn, signOut, useSession } from "next-auth/react";
import TopRightActions from "../lib/components/TopRightActions";
import AuthedRoute from "../lib/layouts/AuthedRoute";
import DashboardLayout from "../lib/layouts/Dashboard";
import { nameOf } from "../utils/names";

export default function UserPage() {
    const { data: session } = useSession();

    return <AuthedRoute>
        <DashboardLayout
            title={nameOf(session?.user, 'Mi perfil')}
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
            <TopRightActions
                actions={[
                    {
                        variant: 'outlined',
                        label: "Cambiar cuenta",
                        async onClick() {
                            await signOut({ redirect: false })
                            await signIn('openid')
                        },
                    },
                    {
                        label: "Cerrar sesión",
                        onClick() {
                            void signOut()
                        },
                    },

                ]}
            />
            <h1 className="text-2xl">{session?.user.email}</h1>
        </DashboardLayout>
    </AuthedRoute >
}