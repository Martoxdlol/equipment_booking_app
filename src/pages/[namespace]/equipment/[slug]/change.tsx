import { useState } from "react";
import Button from "../../../../lib/components/Button";
import DashboardLayout from "../../../../lib/components/DashboardLayout";
import Input from "../../../../lib/components/Input";
import Label from "../../../../lib/components/Label";
import AssetTypeRoute from "../../../../lib/layouts/AssetTypeRoute";
import { api } from "../../../../utils/api";
import { useRouter } from "next/router";
import { apiOperation } from "../../../../lib/util/errors";

export default function ChangeAssetType() {
    return <AssetTypeRoute>
        {function Render({ assetType, namespace }) {


            const [error, setError] = useState('')
            const [message, setMessage] = useState('')
            const [name, setName] = useState(assetType.name)
            const [slug, setSlug] = useState(assetType.slug)


            const { mutateAsync: update } = api.assetType.update.useMutation()

            const router = useRouter()

            function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
                e.preventDefault()
                setError('')
                setMessage('')
                void apiOperation({
                    async action() {
                        await update({ name, slug, id: assetType.id })
                        await router.push(`/${namespace.slug}/equipment`)
                        setMessage('Actualizado correctamente')
                    },
                    onApiError(error) {
                        setError(error.message)
                    },
                })
            }


            return <DashboardLayout
                title={assetType.name}
            >
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid gap-1">
                            {error && <p className="text-red-500 my-1 font-semibold">{error}</p>}
                            {message && <p className="text-blue-500 my-1 font-semibold">{message}</p>}
                            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 mb-auto">
                                <div>
                                    <Label>Nombre</Label>
                                    <Input placeholder="Notebook" onChange={e => setName(e.target.value)} value={name} />
                                </div>
                                <div>
                                    <Label>Identificador</Label>
                                    <Input placeholder="notebook" onChange={e => setSlug(e.target.value)} value={slug} />
                                </div>
                            </div>
                            <div>
                                <Button className="w-full">Guardar</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        }}
    </AssetTypeRoute>
}