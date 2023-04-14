import { Dialog } from "@mui/material"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface Modal {
    Component: ({ }: any) => any
    id: number
}


interface ModalsContext {
    openModal: (children: any) => number
    closeModal: (id: number) => void
}

interface CurrentModalContext {
    id: number
}


const context = createContext<ModalsContext>({ closeModal: (_) => { }, openModal: (_) => 0 })

const currentContext = createContext<CurrentModalContext>({ id: 0 })


function useGenId() {
    const nextId = useRef(0)
    const [modalNextId, setModalNextId] = useState(nextId.current)

    return () => {
        const n = nextId.current + 1
        setModalNextId(n)
        nextId.current = n
        return n
    }
}

export function ModalsProvider({ children }: any) {


    const nextId = useGenId()


    const modals = useRef<Modal[]>([])
    const closingModals = useRef<Set<number>>(new Set())

    function openModal(children: any) {
        let node = children

        if (typeof children === 'function') {
            const C = children
            node = <C />
        }

        const id = nextId()

        modals.current = [
            ...modals.current,
            {
                Component: ({ ...props }) => {
                    return <Dialog {...props} fullWidth>
                        {node}
                    </Dialog>
                }, id
            }
        ]

        nextId()

        return id
    }

    function closeModal(id: number) {
        closingModals.current.add(id)
        nextId()
        setTimeout(() => {
            closingModals.current.delete(id)
            modals.current = modals.current.filter(m => m.id != id)
            nextId()
        }, 200)
    }

    return <div>
        <context.Provider value={{ closeModal, openModal }}>
            <div style={{ position: 'absolute', height: '0', width: '0', top: '0', left: '0' }}>
                {modals.current.map(modal => <div style={{ position: 'fixed', height: '100%', width: '100%', top: '0', left: '0', right: '0' }} key={modal.id}>
                    <currentContext.Provider value={{ id: modal.id }}>
                        <modal.Component open={!closingModals.current.has(modal.id)} />
                    </currentContext.Provider>
                </div>)}
            </div>
            <div>
                {children}
            </div>
        </context.Provider>
    </div>
}

export function useOpenModal() {
    return useContext(context).openModal
}

export function useConfirm() {
    const openModal = useOpenModal()

    return (props: { title?: string, details?: string }) => {

        return new Promise((resolve, reject) => {
            openModal(() => {
                const close = useCloseCurrentModal()

                return <>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {props.details}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { resolve(false); close() }}>Cancelar</Button>
                        <Button onClick={() => { resolve(true); close() }}>Aceptar</Button>
                    </DialogActions>
                </>
            })
        })
    }
}

export function useCloseModal() {
    return useContext(context).closeModal
}

export function useCloseCurrentModal() {
    const current = useContext(currentContext)
    const closeModal = useContext(context).closeModal
    return () => {
        closeModal(current.id)
    }
}