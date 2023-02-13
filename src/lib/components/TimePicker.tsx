import { useEffect } from "react"
import Select from "./Select"

export type Time = { hours: number, minutes: number } | { hours: number | null, minutes: number | null, }

export default function TimePicker({ value, onChange }: {
    value?: Time
    onChange: (value: Time) => void
    label?: React.ReactNode
}) {

    useEffect(() => {
        if (!value) {
            const now = new Date()
            onChange({
                hours: now.getHours(),
                minutes: now.getMinutes(),
            })
        }
    }, [])

    return <div className="grid grid-cols-2">
        <Select
            radiusLeft
            value={value?.hours?.toString()}
            onChange={v => onChange({
                hours: parseInt(v),
                minutes: value?.minutes || null,
            })}
            options={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
            ]}
            placeHolder="Horas"
        />
        <Select
            radiusRight
            value={value?.minutes?.toString()}
            onChange={v => onChange({
                minutes: parseInt(v),
                hours: value?.hours || null,
            })} options={[
                { label: '00', value: '00' },
                { label: '30', value: '30' },
            ]}
            placeHolder="Minutos"
        />
    </div>
}