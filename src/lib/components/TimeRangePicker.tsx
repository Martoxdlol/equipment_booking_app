import dayjs from "dayjs";
import Label from "./Label";
import Select from "./Select";
import DatePicker from "./DatePicker";
import Input from "./Input";

interface Date {
    year: number
    month: number
    day: number
}

export default function TimeRangePicker(props: { value: { from: Date, duartion: number } | null, onChange: (value: { from: Date, duartion: number }) => void }) {

    let current = dayjs().startOf('week')

    if (props.value) {
        current = dayjs(`${props.value.from.year}-${props.value.from.month}-${props.value.from.day}`)
    }

    const from = {
        day: current.get('date'),
        month: current.get('month') + 1,
        year: current.get('year'),
    }

    const toDate = current.add(props.value?.duartion || 30, 'day')

    const to = {
        day: toDate.get('date'),
        month: toDate.get('month') + 1,
        year: toDate.get('year'),
    }


    return <div className="grid sm:grid-cols-2 gap-1" style={{ display: 'grid' }}>
        <div>
            <Label>Desde</Label>
            <DatePicker onChange={(value) => {
                if (!value || !value.day || !value.month || !value.year) return;

                props.onChange({
                    from: {
                        day: value.day,
                        month: value.month,
                        year: value.year,
                    },
                    duartion: props.value?.duartion || 30
                })
            }} value={from} />
        </div>
        <div>
            <Label>Hasta</Label>
            <DatePicker onChange={(value) => {
                if (!value || !value.day || !value.month || !value.year) return;

                const date = dayjs(`${value.year}-${value.month}-${value.day}`)

                const diff = Math.floor((date.valueOf() - current.valueOf()) / (1000 * 60 * 60 * 24))

                if (diff < 1) return;

                props.onChange({
                    from: from || current,
                    duartion: diff || 30
                })
            }} value={to} />
        </div>
    </div>
}