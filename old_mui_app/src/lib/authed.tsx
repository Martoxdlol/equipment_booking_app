import { Button, CircularProgress, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { signIn } from 'next-auth/react'

export enum AuthLevel {
    public = "public",
    normal = "normal",
    privileged = "privileged",
    god = "god",
}

export interface AuthedRouteProps {
    children: any
    authLevel?: AuthLevel
    loadingFallback?: any
    signedOutFallback?: any
}

export default function AuthedRoute(props: AuthedRouteProps) {
    const session = useSession()

    const authLevel = props.authLevel || AuthLevel.normal

    if (authLevel == AuthLevel.public) {
        return props.children
    }

    if (session.status == 'loading') {
        return props.loadingFallback || <Grid display='flex' justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Grid >
    }

    if (session.status == 'authenticated') {
        return props.children
    }

    return props.signedOutFallback || <Grid display='flex' justifyContent="center" alignItems="center" height="100vh">
        <Button onClick={() => signIn('azure-ad')}>Login</Button>
    </Grid >
}