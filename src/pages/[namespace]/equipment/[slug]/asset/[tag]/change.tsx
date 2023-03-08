import { useRouter } from "next/router"
import { useState } from "react"
import Button from "../../../../../../lib/components/Button"
import DeleteButton from "../../../../../../lib/components/DeleteButton"
import ImagePicker from "../../../../../../lib/components/ImagePicker"
import Input from "../../../../../../lib/components/Input"
import Label from "../../../../../../lib/components/Label"
import { AssetRoute } from "../../../../../../lib/layouts/AssetRoute"
import DashboardLayout from "../../../../../../lib/layouts/Dashboard"
import assetRow from "../../../../../../lib/util/assetRow"
import { apiOperation } from "../../../../../../lib/util/errors"
import { api } from "../../../../../../utils/api"

export default function DashboardAsset() {
    return <AssetRoute>
        {function Render({ asset, namespace, assetType }) {
            const router = useRouter()

            const [error, setError] = useState('')
            const [slug, setSlug] = useState(asset.tag || '')
            const [name, setName] = useState(asset.name || '')
            const [enabled, setEnabled] = useState(asset.enabled)
            const [picture, setPictrue] = useState(asset.picture || undefined)

            const { mutateAsync: update } = api.assetType.updateAsset.useMutation()
            const { mutateAsync: deleteAsset } = api.assetType.deleteAsset.useMutation()

            function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
                e.preventDefault()
                setError('')
                void apiOperation({
                    async action() {
                        await update({ tag: slug, name, id: asset.id, picture })
                        await router.push(`/${namespace.slug}/equipment/${assetType.slug}/asset/${asset.tag}`)
                    },
                    onApiError(error) {
                        setError(error.message)
                    },
                })
            }

            return <DashboardLayout title={asset.tag}
                row={assetRow({ namespace: namespace.slug, slug: assetType.slug, tag: asset.tag })}
            >
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid gap-1">
                            <p className="text-red-500 my-1 font-semibold">{error}</p>
                            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 mb-auto">
                                <div>
                                    <Label>Tag</Label>
                                    <Input placeholder="PC-01-10-22" onChange={e => setSlug(e.target.value)} value={slug} />
                                </div>
                                <div>
                                    <Label>Nombre</Label>
                                    <Input placeholder="N22" onChange={e => setName(e.target.value)} value={name || undefined} />
                                </div>
                            </div>
                            <div>
                                <Label>Imagen (icono)</Label>
                                <ImagePicker onChangeUrl={url => setPictrue(url)} url={picture} />
                            </div>
                            <div>
                                <Button className="w-full">Guardar</Button>
                            </div>
                            <div>
                                <DeleteButton
                                    onConfirmDelete={async () => {
                                        await deleteAsset(asset.id)
                                        await router.push(`/${namespace.slug}/equipment/${assetType.slug}`)
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        }}
    </AssetRoute>
}