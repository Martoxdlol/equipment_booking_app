import { useRouter } from "next/router"
import Button from "../../../../../../lib/components/Button"
import { AssetRoute } from "../../../../../../lib/layouts/AssetRoute"
import DashboardLayout from "../../../../../../lib/layouts/Dashboard"
import assetRow from "../../../../../../lib/util/assetRow"
import { api } from "../../../../../../utils/api"

export default function DashboardAsset() {
    return <AssetRoute>
        {function Render({ asset, namespace, assetType, update }) {
            const router = useRouter()

            const booking = asset.inUseAsset?.booking

            const { mutateAsync: setAssetEnabled } = api.assetType.setAssetEnabled.useMutation()

            return <DashboardLayout title={asset.tag}
                imageUrl={asset.picture || assetType.picture || undefined}
                row={assetRow({ namespace: namespace.slug, slug: assetType.slug, tag: asset.tag })}
            >
                <div className="relative w.full h-1">
                    <div className="absolute top-0 right-0 flex gap-1">
                        <Button onClick={() => void router.push(`/${namespace.slug}/equipment/${assetType.slug}/asset/${asset.tag}/change`)} variant="outlined">Editar</Button>
                        <Button
                            variant={!asset.enabled ? "outlined" : 'colored'}
                            onClick={() => {
                                if (asset.enabled) {
                                    void setAssetEnabled({ id: asset.id, enabled: false }).then(() => update())
                                } else {
                                    void setAssetEnabled({ id: asset.id, enabled: true }).then(() => update())
                                }
                            }}>{asset.enabled ? "Deshabilitar" : 'Habilitar'}</Button>
                    </div>
                </div>

                <h1 className="text-lg font-semibold mb-2">{asset.name}</h1>


                {booking && <div className="bg-yellow-100 border border-yellow-300 p-2 rounded-md mb-2">
                    <h2 className="font-semibold mb-1">En uso</h2>
                    <div>Por <b>{booking.user.user?.name}</b></div>
                </div>}
            </DashboardLayout>
        }}
    </AssetRoute>
}