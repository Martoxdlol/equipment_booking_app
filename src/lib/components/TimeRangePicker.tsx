import dayjs from "dayjs";
import Label from "./Label";
import Select from "./Select";
import DatePicker from "./DatePicker";

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
            <Select
                radiusLeft
                radiusRight
                value={props.value?.duartion.toString()}
                options={[
                    { label: 'Un día', value: '1' },
                    { label: 'Un semana', value: '7' },
                    { label: 'Un mes', value: '30' },
                    { label: '2 meses', value: '61' },
                    { label: '3 meses', value: '92' },
                    { label: '6 meses', value: '184' },
                    { label: 'Un año', value: '365' },
                ]}
                onChange={(v) => {
                    props.onChange({
                        from: from,
                        duartion: parseInt(v)
                    })
                }}
            />
        </div>
    </div>
}