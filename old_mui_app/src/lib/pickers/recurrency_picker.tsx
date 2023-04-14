import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

import moment from "moment";
import PickerButton from "./picker_button";


function weeksFromTo(from: Date, to: Date) {
    const weekMs = 1000 * 60 * 60 * 24 * 7
    const fromMs = moment(from).startOf('day').valueOf()
    const toMs = moment(to).startOf('day').valueOf()

    if (fromMs >= toMs) return 0;
    return Math.floor((toMs - fromMs) / weekMs)
}


export default function WeeklyRecurrencyPicker({ onValueChange, value, initialDate }: TimeRangePickerProps) {

    if (!initialDate) {
        return <PickerButton
            showWarning={false}
            startIcon={<EventRepeatIcon />}>
            <p>Pedido recurrente semanal: no</p>
            <p style={{ color: '#666' }}>(Debés elegir la fecha primero)</p>
        </PickerButton>
    }


    return <MobileDatePicker
        value={moment(initialDate).add(value, 'weeks')}
        onChange={(newValue) => {
            if (!newValue) return
            onValueChange(weeksFromTo(initialDate, new Date(newValue.valueOf())))
        }}
        label="Repetir hasta"
        renderInput={(params) => <PickerButton
            showWarning={false}
            startIcon={<EventRepeatIcon />}
            onClick={params.onClick}>
            {!!value && `Todos los ${moment(initialDate).format('dddd').toLocaleLowerCase()} por ${value + 1} semanas`}
            {!value && <>
                <p>Pedido recurrente semanal: no</p>
                {!initialDate && <p style={{ color: '#666' }}>(Debés elegir la fecha primero)</p>}
            </>}
            {!!value && <p style={{ overflowX: 'auto' }}>
                {[...Array(value + 1)].map((_, i) => moment(initialDate).add(i, 'weeks').format('D MMM')).join(' | ')}
            </p>}
        </PickerButton>
        }
    />
}

interface TimeRangePickerProps {
    initialDate: Date | null,
    value: number,
    onValueChange: (value: TimeRangePickerProps['value']) => void
}
