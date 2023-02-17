import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useNamespace } from "../components/NamespaceProvider";
import LoadingFullPage from "./LoadingFullPage";
import NotFoundFullPage from "./NotFoundFullPage";
import type { NamespaceSettings, AssetType, Asset } from "@prisma/client";
import React from "react";
import AssetTypeRoute from "./AssetTypeRoute";

interface AssetRouteProps {
    children: (props: { assetType: AssetType, namespace: NamespaceSettings, asset: Asset }) => JSX.Element
}



export function AssetRoute(props: AssetRouteProps) {
    return <AssetTypeRoute>
        {function Render({ assetType, namespace }) {
            const router = useRouter()
            const tag = router.query.tag?.toString() || ''

            const { data: asset, isInitialLoading } = api.assetType.getAsset.useQuery({ typeId: assetType.id, tag: tag })

            if (!asset && !isInitialLoading) return <NotFoundFullPage />

            if (!asset) return <LoadingFullPage />

            return React.createElement(props.children, { assetType, namespace, asset })
        }}
    </AssetTypeRoute>
}
