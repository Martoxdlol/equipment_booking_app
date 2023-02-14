import { useEffect } from "react"
import Select from "./Select"

export type ElegibleTime = { id: string };

export default function ElegibleTimePicker({ value, onChange, minExcludeId, maxExcludeId }: {
    value?: ElegibleTime
    onChange: (value: ElegibleTime) => void
    label?: React.ReactNode
    minExcludeId?: string
    maxExcludeId?: string

}) {
    const options = [
        { label: '7:30', value: '10', },
        { label: '8:30', value: '20' },
        { label: '9:30', value: '30' },
    ]

    let minIndex = options.findIndex(o => o.value == minExcludeId)
    let maxIndex = options.findIndex(o => o.value == maxExcludeId)

    if (minIndex == -1) minIndex = -1;
    if (maxIndex == -1) maxIndex = options.length;

    const filteredOptions = options.slice(minIndex + 1, maxIndex)

    return <div className="grid grid-cols-1">
        <Select
            radiusLeft
            radiusRight
            value={value?.id}
            onChange={v => onChange({ id: v })}
            options={filteredOptions}
            placeHolder="Horario"
        />

    </div>
}