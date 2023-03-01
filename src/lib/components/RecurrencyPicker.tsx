import type { Date } from "./DatePicker";
import Select from "./Select";
import dayjs from 'dayjs'

interface Props {
    initialDate?: Date
    vale: number
    onChange: (weeks: number) => void
    disabled?: boolean
}

export default function RecurrencyPicker(props: Props) {

    if (!props.initialDate || !props.initialDate.year || !props.initialDate.month || !props.initialDate.day) {
        return <button>

        </button>
    }

    const jsDate = new window.Date(props.initialDate.year, props.initialDate.month, props.initialDate.day,)
    const initialDate = dayjs(`${props.initialDate.year}/${props.initialDate.month}/${props.initialDate.day}`)

    const options: { label: string, value: string }[] = []

    for (let i = 1; i <= 53; i++) {
        const date = initialDate.add(i * 7, 'day')
        options.push({
            label: date.format('dddd D [de] MMMM' + (dayjs().year() === date.year() ? '' : ' [de] YYYY')) + ` (${i+1} semanas)`,
            value: i.toString()
        })
    }

    return <Select
        disabled={props.disabled}
        radiusLeft
        radiusRight
        options={options}
        value={props.vale.toString()}
        onChange={v => props.onChange(parseInt(v))}
    />
}