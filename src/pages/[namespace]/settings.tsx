import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../lib/components/Button";
import ElegibleTimeOption from "../../lib/components/ElegibleTimeOption";
import ImagePicker from "../../lib/components/ImagePicker";
import Input from "../../lib/components/Input";
import Label from "../../lib/components/Label";
import { useNamespace } from "../../lib/components/NamespaceProvider";
import Switch from "../../lib/components/Switch";
import UserConfigurator from "../../lib/components/UserConfigurator";
import DashboardLayout from "../../lib/layouts/Dashboard";
import NamespaceAdminRoute from "../../lib/layouts/NamespaceAdminRoute";
import { apiOperation } from "../../lib/util/errors";
import namespaceRow from "../../lib/util/namespaceRow";
import { api } from "../../utils/api";


export default function DashboardNamespaceSettings() {
    return <NamespaceAdminRoute>
        {function Render({ namespace }) {

            // const router = useRouter()

            const [error, setError] = useState('')
            const [name, setName] = useState(namespace.name)
            const [slug, setSlug] = useState(namespace.slug)
            const [allowUsersByDefault, setAllowUsersByDefault] = useState<boolean>(!!namespace.allowUsersByDefault)
            const [picture, setPicture] = useState<string | null>(namespace.picture)

            const { data: times, refetch: refetchTimes } = api.namespace.adminElegibleTimes.useQuery()
            const { data: users, refetch: refetchUsers } = api.namespace.users.useQuery()
            const { mutateAsync: addElegibleTime } = api.namespace.addElegibleTime.useMutation()
            const { mutateAsync: removeElegibleTime } = api.namespace.removeElegibleTime.useMutation()
            const { mutateAsync: setElegibleTimeEnabled } = api.namespace.setElegibleTimeEnabled.useMutation()
            const { mutateAsync: addUser } = api.namespace.addUser.useMutation()
            const { mutateAsync: updateNamespace } = api.namespace.update.useMutation()

            const [newTime, setNewTime] = useState({ hours: 0, minutes: 0 })

            function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
                e.preventDefault()
                void apiOperation({
                    async action() {
                        if (!namespace) return
                        await updateNamespace({ name, slug, id: namespace.id, picture: picture, allowUsersByDefault })
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
                title={namespace?.name}
                row={namespaceRow(namespace.slug)}

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
                                <Label>Imagen (icono)</Label>
                                <ImagePicker
                                    onChangeUrl={u => setPicture(u || null)}
                                    url={picture || undefined}
                                />
                            </div>
                            <div>
                                <Label>Permitir usuarios nuevo hacer pedidos</Label>
                                <p>Esto hace que cualquier usuario que ingrese se le darán permisos para crear pedidos.</p>
                                <p>Si se desactiva hay que asignar los permisos a mano.</p>
                                <Switch
                                    onChange={setAllowUsersByDefault}
                                    value={allowUsersByDefault}
                                />
                            </div>
                            <div>
                                <Button className="w-full">Guardar configuración</Button>
                            </div>
                        </div>
                    </form>
                    <div>
                        <Label>Horarios elegibles</Label>
                        {(times && times?.length == 0) && <p className="py-2 px-1 text-gray-500 border rounded-md my-1">Agregue horarios que se puedan crear pedidos</p>}
                        {!times && <p className="py-2 px-1 text-gray-500 border rounded-md my-1">Cargando...</p>}
                        {/* <ElegibleTimeOption addMode={false} value={{hours: 7, minutes: 30, id: ''}}/> */}


                        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1">
                            {times?.map(time => <ElegibleTimeOption
                                key={time.id}
                                addMode={false}
                                value={time}
                                onSetEnabled={async (enabled) => {
                                    await setElegibleTimeEnabled({ id: time.id, enabled })
                                    await refetchTimes()
                                }}
                                onRemove={() => {
                                    void apiOperation({
                                        async action() {
                                            await removeElegibleTime(time.id);
                                            await refetchTimes();
                                        },
                                        onApiError(error) {
                                            alert(error.message)
                                        }
                                    })
                                }}
                            />)}
                        </div>

                        <Label> Nuevo horario elegible</Label>
                        <ElegibleTimeOption value={newTime} onChange={setNewTime} addMode onAdd={() => {
                            void apiOperation({
                                async action() {
                                    await addElegibleTime(newTime);
                                    await refetchTimes();
                                },
                                onApiError(error) {
                                    console.error(error)
                                },
                            })
                        }} />

                        <Label className="mt-2">Usuarios</Label>
                        <div className="grid gap-1">
                            {users?.map(user => <UserConfigurator key={user.id} user={user} onUpdateNeeded={refetchUsers}/>)}
                        </div>
                        <Button className="w-full mt-2" variant="outlined"
                            onClick={() => {
                                const name = prompt('Nombre del usuario')?.trim()
                                if (!name) return
                                const email = prompt('Email del usuario')?.trim()
                                if (!email) return
                                void apiOperation({
                                    async action() {
                                        await addUser({ name, email })
                                        await refetchUsers()
                                    },
                                    onApiError(error) {
                                        alert(error.message)
                                    }
                                })
                            }}
                        >Nuevo usuario</Button>
                    </div>
                </div>

            </DashboardLayout >
        }}
    </NamespaceAdminRoute>
}
