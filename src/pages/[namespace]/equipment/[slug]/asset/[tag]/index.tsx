import { useRouter } from "next/router"
import Button from "../../../../../../lib/components/Button"
import { AssetRoute } from "../../../../../../lib/layouts/AssetRoute"
import DashboardLayout from "../../../../../../lib/layouts/Dashboard"
import assetRow from "../../../../../../lib/util/assetRow"
import { api } from "../../../../../../utils/api"
import { nameOf } from "../../../../../../utils/names"
import Label from "../../../../../../lib/components/Label"
import dayjs from "dayjs"
import Link from "next/link"
import { useMemo } from "react"

export default function DashboardAsset() {
    return <AssetRoute>
        {function Render({ asset, namespace, assetType, update }) {
            const router = useRouter()

            const booking = asset.inUseAsset?.booking

            const { mutateAsync: setAssetEnabled } = api.assetType.setAssetEnabled.useMutation()

            const events = useMemo(() => {
                return asset.events.sort((a, b) => {
                    const d1 = dayjs((a.returnedAt ?? a.deployedAt).toString())
                    const d2 = dayjs((b.returnedAt ?? b.deployedAt).toString())

                    if(d1.isAfter(d2)) return -1
                    if(d2.isAfter(d1)) return 1
                    return 0
                })
            }, [asset])

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
                    <div>Por <b>{nameOf(booking.user)}</b></div>
                </div>}
                <div>{events.map(event => {
                    const dateDeployed = dayjs(event.deployedAt.toString()).format('DD/MM/YYYY [-] HH:mm:ss')
                    const dateReturned = event.returnedAt ? dayjs(event.returnedAt.toString()).format('DD/MM/YYYY [-] HH:mm:ss') : null

                    return <div key={event.id} className="my-2 border p-1 rounded-md">
                        <Label>{event.returnedAt ? '' : 'Entregado a '} {event.booking.user.name + ' '}</Label>
                        <span className="text-sm">
                        <p className="font-semibold text-fuchsia-600">{dateDeployed && <span>Entregado el {' '}</span>}{dateDeployed}</p>
                            {dateReturned && <p className="font-semibold text-fuchsia-600">Devuelto el {dateReturned}</p>}
                        </span>
                        <p><Link href={`/${namespace.slug}/bookings/${event.booking.id}`}
                            className="text-blue-500 text-sm font-semibold"
                        >Ver pedido original</Link></p>
                    </div>
                })}</div>
            </DashboardLayout>
        }}
    </AssetRoute>
}