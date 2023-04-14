import { useCloseCurrentModal, useOpenModal } from "lib/modals/modals";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PickerButton from "./picker_button";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

export default function EquipmentPicker() {
    const openModal = useOpenModal()
    return <PickerButton
        startIcon={<AccountTreeOutlinedIcon />}
        onClick={() => {
            openModal(<EquipmentPickerModal />)
        }}
    >
        Elegir equipamiento
    </PickerButton>

}

function EquipmentPickerModal() {
    const closeModal = useCloseCurrentModal()

    return <>
        <DialogTitle>Elegir equipamiento</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>
            <Button onClick={closeModal}>Aceptar</Button>
        </DialogActions>
    </>
}