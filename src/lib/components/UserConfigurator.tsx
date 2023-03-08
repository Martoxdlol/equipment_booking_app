import classNames from "classnames"
import { api, type RouterOutputs, type Unpacked } from "../../utils/api"
import { apiOperation } from "../util/errors"

export default function UserConfigurator(props: {
    user: Unpacked<RouterOutputs['namespace']['users']>,
    onUpdateNeeded?: () => unknown
}) {
    const { mutateAsync: unlikUser } = api.namespace.unlikUser.useMutation()
    const { mutateAsync: changeUser } = api.namespace.changeUser.useMutation()
    const { mutateAsync: deleteUser } = api.namespace.deleteUser.useMutation()
    const { mutateAsync: makeAdmin } = api.namespace.makeAdmin.useMutation()
    const { mutateAsync: removeAdmin } = api.namespace.removeAdmin.useMutation()

    const isLinked = !!props.user.user

    const isAdmin = props.user.user?.permissions.find(p => p.admin)
    const isGlobalAdmin = props.user.user?.globalAdmin

    async function changeName() {
        const newName = prompt('Nombre', props.user.name)
        if (!newName) return
        await changeUser({ id: props.user.id, name: newName, email: props.user.email })
        props.onUpdateNeeded && props.onUpdateNeeded()
    }

    async function changeEmail() {
        const newEmail = prompt('Email', props.user.email)
        if (!newEmail) return
        await changeUser({ id: props.user.id, name: props.user.name, email: newEmail })
        props.onUpdateNeeded && props.onUpdateNeeded()
    }


    async function unlink() {
        const confirm = window.confirm('Desvincular inicio de sesión\nEsto permite cambiar el mail y asociar el usuario en el sistema con otro usuario de inicio de sesión')
        if (confirm) {
            await unlikUser(props.user.id)
            props.onUpdateNeeded && props.onUpdateNeeded()
        }
    }

    async function removeUser() {
        const confirm = window.confirm('Eliminar usuario\nEsto eliminará el usuario del sistema y no podrá ser recuperado.\nSi el usuario está en uso en algún pedido no se podrá eliminar')
        if (confirm) {
            await apiOperation({
                action() {
                    return deleteUser(props.user.id)
                },
                onApiError(error) {
                    alert(error.message)
                }
            })
            props.onUpdateNeeded && props.onUpdateNeeded()
        }
    }

    async function makeUserAdmin() {
        await apiOperation({
            async action() {
                if (!props.user.user) return
                return await makeAdmin(props.user.user.id)
            },
            onApiError(error) {
                alert(error.message)
            }
        })
        props.onUpdateNeeded && props.onUpdateNeeded()
    }

    async function removeUserAdmin() {
        await apiOperation({
            async action() {
                if (!props.user.user) return
                return  await removeAdmin(props.user.user.id)
            },
            onApiError(error) {
                alert(error.message)
            }
        })
        props.onUpdateNeeded && props.onUpdateNeeded()
    }

    return <div className="border rounded-md p-1">
        <p className="font-semibold">{props.user.name || '<sin nombre>'} <SlimButton onClick={changeName}>cambiar</SlimButton> {!isLinked && <SlimButton onClick={removeUser} red>eliminar</SlimButton>}</p>
        <p className="text-sm">{props.user.email} {isLinked ? <SlimButton onClick={unlink}>desvincular</SlimButton> : <SlimButton onClick={changeEmail}>cambiar</SlimButton>}</p>{
            props.user.user && <div className="bg-blue-500 rounded-md font-semibold text-white px-1 text-sm inline-block">
                <p>El usuario ingresó al menos una vez. (Está vinculado)</p>
            </div>
        }
        {isLinked && <div className="flex gap-1 text-[12px] mt-1">
            {isGlobalAdmin && <p className="text-[12px] font-semibold text-blue-500">ADMINISTRADOR GLOBAL</p>}
            {!isAdmin && <SlimButton onClick={makeUserAdmin}>HACER ADMINISTRADOR</SlimButton>}
            {isAdmin && <SlimButton onClick={removeUserAdmin}>QUITAR ADMINISTRADOR</SlimButton>}
        </div>}
    </div>
}

function SlimButton(props: { children: React.ReactNode, onClick?: () => unknown, red?: boolean }) {
    return <span className={classNames("opacity-20 hover:opacity-100 cursor-pointer font-semibold", {
        'text-blue-500': !props.red,
        'text-red-500': props.red,
    })} onClick={props.onClick}>{props.children}</span>
}