import { useEffect } from "react"
import Select from "./Select"

export type ElegibleTime = { hours: number, minutes: number };

export default function ElegibleTimePicker({ value, onChange }: {
    value?: ElegibleTime
    onChange: (value: ElegibleTime) => void
    label?: React.ReactNode
}) {
    return <div className="grid grid-cols-1">
        <Select
            radiusLeft
            radiusRight
            value={value?.hours?.toString()}
            onChange={v => onChange({minutes: 1, hours: 1})}
            options={[
                { label: '7:30', value: '7:30' },
                { label: '8:30', value: '8:30' },
            ]}
            placeHolder="Horario"
        />

    </div>
}