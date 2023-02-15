import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Button from "../../lib/components/Button";
import DashboardLayout, { RowLink } from "../../lib/components/DashboardLayout";
import ElegibleTimeOption from "../../lib/components/ElegibleTimeOption";
import Input from "../../lib/components/Input";
import Label from "../../lib/components/Label";
import { useNamespace } from "../../lib/components/NamespaceProvider";
import { apiOperation } from "../../lib/util/errors";
import namespaceRow from "../../lib/util/namespaceRow";
import { api } from "../../utils/api";
import { useNamespaceSlug } from "../../utils/hooks";

export default function DashboardOverview() {

    const namespace = useNamespace()
    const namespaceSlug = useNamespaceSlug()
    // const session = useSession()


    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')

    const { data: times, refetch: refetchTimes } = api.namespace.elegibleTimes.useQuery()
    const { mutateAsync: addElegibleTime } = api.namespace.addElegibleTime.useMutation()

    const [newTime, setNewTime] = useState({ hours: 0, minutes: 0 })

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        void apiOperation({
            async action() {
                await create({ name, slug })
                await router.push(`/${slug}`)
            },
            onApiError(error) {
                if (error.code == 'BAD_REQUEST') {
                    setError(error.message)
                }
            },
        })
    }


    return <DashboardLayout
        title={namespace?.name}
        row={namespaceRow(namespaceSlug)}

    >
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <form action="" onSubmit={handleSubmit}>
                <p className="text-red-500 my-1 font-semibold">{error}</p>
                <div className="grid gap-1">
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
            <div>
                <Label>Horarios elegibles</Label>
                {(times && times?.length == 0) && <p className="py-2 px-1 text-gray-500 border rounded-md my-1">Agregue horarios que se puedan crear pedidos</p>}
                {!times && <p className="py-2 px-1 text-gray-500 border rounded-md my-1">Cargando...</p>}
                {/* <ElegibleTimeOption addMode={false} value={{hours: 7, minutes: 30, id: ''}}/> */}


                {times?.map(time => <ElegibleTimeOption key={time.id} addMode={false} value={time} />)}

                < Label > Nuevo horario elegible</Label>
                <ElegibleTimeOption value={newTime} onChange={setNewTime} addMode onAdd={() => {
                    void apiOperation({
                        async action() {
                            await addElegibleTime(newTime);
                            await refetchTimes();
                        },
                        onApiError(error) {
                            console.log(error)
                        },
                    })
                }} />
            </div>
        </div>

    </DashboardLayout >
}
