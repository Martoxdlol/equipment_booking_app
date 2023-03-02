import { useRouter } from "next/router"
import { useState } from "react"
import Button from "../../lib/components/Button"
import Input from "../../lib/components/Input"
import Label from "../../lib/components/Label"
import DashboardLayout from "../../lib/layouts/Dashboard"
import { apiOperation } from "../../lib/util/errors"
import { api } from "../../utils/api"

export default function DashboardCreateNamespace() {

    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')

    const { mutateAsync: create } = api.namespace.create.useMutation()

    const router = useRouter()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        void apiOperation({
            async action() {
                await create({ name, slug })
                window.location.href = `/${slug}`
            },
            onApiError(error) {
                if (error.code == 'BAD_REQUEST') {
                    setError(error.message)
                }
            },
        })
    }

    return <DashboardLayout
        title="New namespace"
    >
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <form action="" onSubmit={handleSubmit}>
                <div className="grid gap-1">
                    <p className="text-red-500 my-1 font-semibold">{error}</p>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 mb-auto">
                        <div>
                            <Label>Nombre</Label>
                            <Input placeholder="Escuela Técnica Henry Ford" onChange={e => setName(e.target.value)} value={name} />
                        </div>
                        <div>
                            <Label>Identificador</Label>
                            <Input placeholder="ethf" onChange={e => setSlug(e.target.value)} value={slug} />
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