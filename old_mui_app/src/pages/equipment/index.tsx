import AuthedRoute from "lib/authed"
import BottomMenu from "lib/components/bottom_menu/bottom_menu"
import Scaffold from "lib/components/scaffold/scaffold"
import Container from '@mui/material/Container';
import { useCloseCurrentModal, useOpenModal } from "lib/modals/modals"
import MenuAppBar from "lib/components/app_bar/app_bar";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';


import { useState } from 'react'

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { removeDiacritics } from "utils/text_utils";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";


export default function EquipmentPage() {

    const openModal = useOpenModal()

    // const [assetTypes, setAssetTypes] = useState<{ id: string; title: string; }[]>([])
    const { data: assetTypes, refetch: refetch } = trpc.assets.getAssetTypes.useQuery()

    const router = useRouter()

    return <AuthedRoute>
        <Scaffold
            topHeight="76px"
            top={<MenuAppBar />}
            bottom={<BottomMenu />}
        >
            <Container maxWidth="xl">
                <Box>
                    <Button
                        onClick={() => openModal(<EquipmentTypeFormModal onSave={refetch}/>)}
                    >Agregar tipo de equipo</Button>

                </Box>


                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {assetTypes?.map(type => <ListItem
                        key={type.id}
                        secondaryAction={"Información"}
                        disablePadding
                    >

                        <ListItemButton
                            onClick={() => router.push('/equipment/' + type.id)}


                        >
                            <ListItemAvatar>
                                <Avatar src="https://mui.com/static/images/avatar/2.jpg" />
                            </ListItemAvatar>
                            <ListItemText primary={type.title} secondary={type.id} />
                        </ListItemButton>
                    </ListItem>
                    )}</List>
            </Container>
        </Scaffold>
    </AuthedRoute >

}

export function EquipmentTypeFormModal(props: { id?: string, name?: string, onSave?: () => void }) {
    const closeModal = useCloseCurrentModal()

    const isNew = !props.id

    const [id, setId] = useState(props.id || '')
    const [name, _setName] = useState(props.name || '')

    const [error, setError] = useState('')

    function setName(newName: string) {
        if (idGenFromName(name) == id) {
            setId(idGenFromName(newName))
        }
        _setName(newName)
    }

    function idGenFromName(name: string) {
        return removeDiacritics(name).toLocaleLowerCase().replace(/[\"\#\$\%\&\/\\\(\)\=\!\|\¡\°\ ]/g, '_')
    }

    const createAssetType = trpc.assets.setAssetType.useMutation()

    async function save() {
        const result = await createAssetType.mutateAsync({
            id: isNew ? id : props.id!, name, isNew
        })
        if (result?.error) {
            setError(result.error)
        } else {
            props.onSave && props.onSave()
            closeModal()
        }
    }

    return <>
        <DialogTitle>Agregar tipo de equipo</DialogTitle>
        <DialogContent>
            {error && <DialogContentText color={'red'}>
                {error}
            </DialogContentText>}
            <DialogContentText>
                Agregar un tipo de equipamiento. Ej: Notebook, Proyector, Parlante, etc...
            </DialogContentText>
            <TextField
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                margin="dense"
                id="name"
                label="Nombre"
                type="text"
                fullWidth
                variant="standard"
            />
            {isNew && <TextField
                value={id}
                onChange={e => setId(e.target.value)}
                margin="dense"
                id="name"
                label="Identificador"
                type="text"
                fullWidth
                variant="standard"
            />}
        </DialogContent>
        <DialogActions>
            <Button onClick={closeModal}>Cancelar</Button>
            <Button onClick={save}>Guardar</Button>
        </DialogActions>
    </>
}