import type { NamespaceSettings } from "@prisma/client";
import { useNamespace } from "../components/NamespaceProvider";
import LoadingFullPage from "./LoadingFullPage";
import React from "react";
import { api } from "../../utils/api";
import NotFoundFullPage from "./NotFoundFullPage";

interface NamespaceRouteProps {
    children: (props: { namespace: NamespaceSettings }) => JSX.Element
}

export default function NamespaceAdminRoute(props: NamespaceRouteProps) {
    const namespace = useNamespace()

    const {data: isAdmin, error } = api.namespace.isAdmin.useQuery()

    if(error) {
        return <NotFoundFullPage />
    }

    if (namespace != null && isAdmin) {
        return React.createElement(props.children, { namespace })
    }

    return <LoadingFullPage />
}