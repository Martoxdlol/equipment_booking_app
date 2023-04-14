import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import moment from "moment";
import PickerButton from "./picker_button";

export default function DatePicker({ onValueChange, value }: TimeRangePickerProps) {
    const isToday = moment(value).startOf('day').valueOf() == moment().startOf('day').valueOf()
    const isTomorrow = moment(value).startOf('day').subtract(1000 * 60 * 60 * 24).valueOf() == moment().startOf('day').valueOf()
    const isYesterday = moment(value).startOf('day').add(1000 * 60 * 60 * 24).valueOf() == moment().startOf('day').valueOf()

    return <MobileDatePicker

        value={value}
        onChange={(newValue) => {
            onValueChange(newValue && new Date(newValue.valueOf()))
        }}
        renderInput={(params) => <PickerButton
            showWarning={!value}
            startIcon={<CalendarMonthIcon />}
            onClick={params.onClick}>
            {(value && !isToday && !isTomorrow && !isYesterday) && <>
                {moment(value).format('ddd D MMM YYYY')}
                {' '}
                ({moment(value).fromNow()})
            </>}
            {(value && isToday) && 'Hoy'}
            {(value && isYesterday) && 'Ayer'}
            {(value && isTomorrow) && 'Mañana'}
            {!value && 'Fecha'}
        </PickerButton>
        }
    />
}

interface TimeRangePickerProps {
    value: Date | number | null,
    onValueChange: (value: TimeRangePickerProps['value']) => void
}
