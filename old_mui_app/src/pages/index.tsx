import { Button } from "@mui/material";
import AuthedRoute from "lib/authed";
import { useCloseCurrentModal, useCloseModal, useOpenModal } from "lib/modals/modals";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Scaffold from "lib/components/scaffold/scaffold";
import AppBar from "lib/components/app_bar/app_bar";
import BottomMenu from "lib/components/bottom_menu/bottom_menu";
import Container from '@mui/material/Container';

export default function App() {

    const openModal = useOpenModal()

    return <AuthedRoute>
        <Scaffold
            topHeight="76px"
            top={<AppBar />}
            bottom={<BottomMenu />}
        >
            <Container maxWidth="xl">

            </Container>
        </Scaffold>
    </AuthedRoute>

}