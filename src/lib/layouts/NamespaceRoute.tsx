import type { NamespaceSettings } from "@prisma/client";
import { useNamespace } from "../components/NamespaceProvider";
import LoadingFullPage from "./LoadingFullPage";
import React from "react";

interface NamespaceRouteProps {
    children: (props: { namespace: NamespaceSettings }) => JSX.Element
}

export default function NamespaceRoute(props: NamespaceRouteProps) {
    const namespace = useNamespace()


    if (namespace != null) {
        return React.createElement(props.children, { namespace })
    }

    return <LoadingFullPage />
}