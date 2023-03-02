import type { NamespaceSettings } from "@prisma/client";
import { useNamespaceInfo } from "../components/NamespaceProvider";
import LoadingFullPage from "./LoadingFullPage";
import React from "react";
import ErrorFullPage from "./ErrorFullPage";
import NotFoundFullPage from "./NotFoundFullPage";
import SignInFullPage from "./SignInPage";
import { useRouter } from "next/router";

interface NamespaceRouteProps {
    children: (props: { namespace: NamespaceSettings }) => JSX.Element
}

export default function NamespaceRoute(props: NamespaceRouteProps): JSX.Element {
    const { namespace, error, isInitialLoading } = useNamespaceInfo()
    const router = useRouter()

    if (error && error.code === 'UNAUTHORIZED') {
        return <SignInFullPage />
    }

    if ((!error && !namespace && !isInitialLoading) || error?.code === 'NOT_FOUND') {
        return <NotFoundFullPage />
    }

    if (error) {
        if(router.query.retry) return <ErrorFullPage />
        window.location.reload()
        return <ErrorFullPage />
    }

    if (namespace != null) {
        return <>{React.createElement(props.children, { namespace })}</>
    }

    return <LoadingFullPage />
}