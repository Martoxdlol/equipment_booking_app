import { useEffect } from "react"
import Select from "./Select"

export type Date = { year: number, month: number, day: number } | { year: number | null, month: number | null, day: number | null }

export default function DatePicker({ value, onChange }: {
    value?: Date
    onChange: (value: Date) => void
    label?: React.ReactNode
}) {

    useEffect(() => {
        if (!value) {
            const now = new Date()
            onChange({
                day: now.getDate(),
                month: now.getMonth() + 1,
                year: now.getFullYear(),
            })
        }
    }, [])

    return <div className="grid grid-cols-3">
        <Select
            radiusLeft
            value={value?.year?.toString()}
            onChange={v => onChange({
                year: parseInt(v),
                month: value?.month || null,
                day: value?.day || null,
            })}
            options={[
                { label: '2022', value: '2022' },
                { label: '2023', value: '2023' },
                { label: '2024', value: '2024' },
            ]}
            placeHolder="Año"
        />
        <Select
            value={value?.month?.toString()}
            onChange={v => onChange({
                month: parseInt(v),
                year: value?.year || null,
                day: value?.day || null,
            })} options={[
                { label: 'Ene.', value: '1' },
                { label: 'Feb.', value: '2' },
                { label: 'Mar.', value: '3' },
                { label: 'Abr.', value: '4' },
                { label: 'May.', value: '5' },
                { label: 'Jun.', value: '6' },
                { label: 'Jul.', value: '7' },
                { label: 'Ago.', value: '8' },
                { label: 'Sep.', value: '9' },
                { label: 'Oct.', value: '10' },
                { label: 'Nov.', value: '11' },
                { label: 'Dic.', value: '12' },
            ]}
            placeHolder="Mes"
        />
        <Select
            radiusRight
            value={value?.day?.toString()}
            onChange={v => onChange({
                day: parseInt(v),
                year: value?.year || null,
                month: value?.month || null,
            })}
            options={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '6', value: '6' },
                { label: '7', value: '7' },
                { label: '8', value: '8' },
                { label: '9', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' },
                { label: '13', value: '13' },
            ]}
            placeHolder="Dia"
        />
    </div>
}