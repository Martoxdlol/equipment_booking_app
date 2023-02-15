import { useRouter } from "next/router"
import { useState } from "react"
import Button from "../../../lib/components/Button"
import DashboardLayout from "../../../lib/components/DashboardLayout"
import Input from "../../../lib/components/Input"
import Label from "../../../lib/components/Label"
import { apiOperation } from "../../../lib/util/errors"
import { api } from "../../../utils/api"
import { useNamespaceSlug } from "../../../utils/hooks"

export default function DashboardCreateNamespace() {

    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')

    const namespaceSlug = useNamespaceSlug()

    const { mutateAsync: create } = api.assetType.create.useMutation()

    const router = useRouter()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        void apiOperation({
            async action() {
                await create({ name, slug })
                await router.push(`/${namespaceSlug}/equipment`)
            },
            onApiError(error) {
                if (error.code == 'BAD_REQUEST') {
                    setError(error.message)
                }
            },
        })
    }

    return <DashboardLayout
        title="Nuevo tipo de asset"
    >
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <form action="" onSubmit={handleSubmit}>
                <div className="grid gap-1">
                    <p className="text-red-500 my-1 font-semibold">{error}</p>
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
                        <Button className="w-full">Crear</Button>
                    </div>
                </div>
            </form>
        </div>

    </DashboardLayout >
}