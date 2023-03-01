import { useEffect } from "react"
import Select from "./Select"
import dayjs from "dayjs"

export type Date = { year: number, month: number, day: number, } | { year: number | null, month: number | null, day: number | null,  }

const weekDays = [
    'Lun',
    'Mar',
    'Mie',
    'Jue',
    'Vie',
    'Sab',
    'Dom',
]

export default function DatePicker({ value, onChange, disabled }: {
    value?: Date
    onChange: (value: Date) => void
    label?: React.ReactNode
    disabled?: boolean
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

    const days: { inWeek: string | undefined, num: number }[] = []

    if (value?.month && value.year) {
        for (let i = 1; i <= getDays(value.year, value.month); i++) {

            const date = new Date(value.year, value.month-1, i)

            days.push({
                inWeek: dayjs(date).format('ddd'),
                num: i
            })
        }
    } else {
        for (let i = 1; i <= 31; i++) {
            days.push({
                inWeek: undefined,
                num: i
            })
        }
    }

    function handleChange(v: Date) {
        const value = { ...v }

        if (value.day && value.year && value.month && getDays(value?.year, value?.month) < value.day) {
            value.day = null
        }

        onChange(value)
    }

    return <div className="grid" style={{gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 10fr) minmax(0, 13fr)'}}>
        <Select
            disabled={disabled}
            radiusLeft
            lessPadding
            value={value?.year?.toString()}
            onChange={v => handleChange({
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
            disabled={disabled}
            value={value?.month?.toString()}
            lessPadding
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
            disabled={disabled}
            radiusRight
            value={value?.day?.toString()}
            onChange={v => onChange({
                day: parseInt(v),
                year: value?.year || null,
                month: value?.month || null,
            })}
            options={days.map(day => {

                return {
                    label: day.inWeek ? <div className="whitespace-nowrap">{day.num} - <b>{day.inWeek.substring(0, 3)}</b></div> : day.num,
                    value: day.num.toString(),
                }

            })}
            lessPadding
            placeHolder="Dia"
        />
    </div>
}

const getDays = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

function getDayName(dateStr: string, locale: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}
