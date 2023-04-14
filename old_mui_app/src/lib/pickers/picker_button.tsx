import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import styles from './pickers.module.css'
import { ReactNode } from 'react'

interface PickerButtonProps {
    startIcon: ReactNode
    showWarning?: boolean
    children?: any
    onClick?: any
    params?: any
}

export default function PickerButton({ startIcon, showWarning, children, onClick, params }: PickerButtonProps) {
    return <Paper elevation={3}>
        <Button
            startIcon={startIcon}
            endIcon={showWarning && <WarningAmberOutlinedIcon color="error" />}
            sx={{ justifyContent: "flex-start", color: 'black', paddingLeft: '30px', paddingRight: '30px' }}
            fullWidth={true}
            onClick={onClick}
            {...params as any}>
            <div className={styles.button}>
                {children}
            </div>
        </Button>
    </ Paper>
}