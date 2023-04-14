import styles from './app_bar.module.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useCloseCurrentModal, useOpenModal } from 'lib/modals/modals';
import Box from '@mui/material/Box';
import { signOut, useSession } from 'next-auth/react';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import { useState } from 'react'

export default function MenuAppBar({ }) {
    const openModal = useOpenModal()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    // openModal(<MenuPopupContent />)

    const session = useSession()
    const name = session.data?.user?.name
    const mail = session.data?.user?.email

    return <div className={styles.app_bar}>

        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} anchor="left">
            <Box
                sx={{ width: 280 }}
                role="presentation"
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton 
                            onClick={() => openModal(<MenuPopupContent />)}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary={name} secondary={mail} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
        <AppBar position="static" color='primary'>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Equipment Booking App
                </Typography>
            </Toolbar>
        </AppBar>
    </div>

}

export function MenuPopupContent() {
    const closeModal = useCloseCurrentModal()
    const session = useSession()
    const mail = session.data?.user?.email
    return <>
        <DialogTitle>{session.data?.user?.name}</DialogTitle>
        <DialogContent>
            {(mail === null || mail === undefined) ? <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
                :
                <DialogContentText>
                    {session.data?.user?.email}
                </DialogContentText>
            }

            {/* <Button variant='outlined' fullWidth>Cerrar sesión</Button> */}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                signOut()
            }} color="error">Cerrar sesión</Button>
            <Button onClick={closeModal}>Aceptar</Button>
        </DialogActions>
    </>
}