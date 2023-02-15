import { useSession } from "next-auth/react";
import LoadingFullPage from "./LoadingFullPage";
import SignedOutPage from "./SignedOutPage";

export default function AuthedRoute(props: { children: React.ReactNode }) {
    const { status } = useSession()

    if (status === 'loading') return <LoadingFullPage />

    if (status === 'unauthenticated') return <SignedOutPage />

    return <>{props.children}</>
}

