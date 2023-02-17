import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useNamespace } from "../components/NamespaceProvider";
import LoadingFullPage from "./LoadingFullPage";
import NotFoundFullPage from "./NotFoundFullPage";
import type { NamespaceSettings, AssetType } from "@prisma/client";
import React from "react";

interface NamespaceRouteProps {
    children: (props: { assetType: AssetType, namespace: NamespaceSettings }) => JSX.Element
}

export default function AssetTypeRoute(props: NamespaceRouteProps) {
    const namespace = useNamespace()
    const router = useRouter()
    const typeSlug = router.query.slug?.toString()

    const { data: assetType, isInitialLoading, error } = api.assetType.getDetailed.useQuery(typeSlug || '')

    if (!typeSlug && !isInitialLoading) return <NotFoundFullPage />
    if (!typeSlug) return <LoadingFullPage />


    if (!isInitialLoading && !assetType) return <NotFoundFullPage />

    if (namespace != null && assetType != null) {
        return React.createElement(props.children, { assetType, namespace })
    }

    return <LoadingFullPage />
}