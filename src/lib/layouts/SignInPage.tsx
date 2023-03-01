import { useRouter } from "next/router";
import DashboardLayout from "./Dashboard";
import { signIn, useSession } from "next-auth/react";
import LoadingFullPage from "./LoadingFullPage";

export default function SignInFullPage() {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingFullPage />
    }

    return <DashboardLayout
        title="Permiso para acceder"
    >
        {status === 'authenticated' && <button className="py-2 w-full border rounded-md" type="button">
            No tienes permiso para ver esta página
        </button>}
        {status === 'unauthenticated' && <button className="py-2 w-full shadow-md border rounded-md" type="button" onClick={() => void signIn('openid')}>
            Iniciar sessión
        </button>}
    </DashboardLayout>
}