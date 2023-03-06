import { useEffect } from "react"
import { api } from "../../utils/api";
import Select from "./Select"

export type ElegibleTime = { id: string };

export default function ElegibleTimePicker({ value, onChange, minExcludeId, maxExcludeId, disabled }: {
    value?: ElegibleTime
    onChange: (value: ElegibleTime) => void
    label?: React.ReactNode
    minExcludeId?: string
    maxExcludeId?: string
    disabled?: boolean
}) {
    const { data: times, refetch: refetchTimes } = api.namespace.elegibleTimes.useQuery()

    const options = times?.map(t => ({ value: t.id, label: `${t.hours}:${t.minutes}` })) || []

    let minIndex = options.findIndex(o => o.value == minExcludeId)
    let maxIndex = options.findIndex(o => o.value == maxExcludeId)

    if (minIndex == -1) minIndex = -1;
    if (maxIndex == -1) maxIndex = options.length;

    const filteredOptions = options.slice(minIndex + 1, maxIndex)

    return <div className="grid grid-cols-1">
        <Select
            disabled={disabled}
            radiusLeft
            radiusRight
            value={value?.id}
            onChange={v => onChange({ id: v })}
            options={filteredOptions}
            placeHolder="Horario"
        />

    </div>
}