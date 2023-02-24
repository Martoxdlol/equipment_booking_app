import type { NamespaceSettings } from "@prisma/client";
import { useNamespaceInfo } from "../components/NamespaceProvider";
import LoadingFullPage from "./LoadingFullPage";
import React from "react";
import ErrorFullPage from "./ErrorFullPage";
import NotFoundFullPage from "./NotFoundFullPage";

interface NamespaceRouteProps {
    children: (props: { namespace: NamespaceSettings }) => JSX.Element
}

export default function NamespaceRoute(props: NamespaceRouteProps) {
    const { namespace, error, isInitialLoading } = useNamespaceInfo()

    if ((!error && !namespace && !isInitialLoading) || error?.code === 'NOT_FOUND' || error?.code === 'UNAUTHORIZED') {
        return <NotFoundFullPage />
    }

    if (error) {
        return <ErrorFullPage />
    }

    if (namespace != null) {
        return React.createElement(props.children, { namespace })
    }

    return <LoadingFullPage />
}