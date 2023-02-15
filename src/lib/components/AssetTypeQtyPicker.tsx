import { useEffect } from "react"

const className = "mt-1 cursor-default border border-gray-300 bg-white py-1 px-1 text-center text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"

interface Props {
    name: React.ReactNode
    value?: number
    onChange: (qty: number) => void
    min: number
    max: number
}

export default function AssetTypeQtyPicker({ name, min, max, value: _value, onChange }: Props) {

    const value = _value || 0

    useEffect(() => {
        if (min > max) return
        onChange(formatValue(value))
    }, [min, max, value])

    function formatValue(value: number) {
        if (max < value) return max
        if (min > value) return min
        return value
    }

    return <div
        className="grid sm:grid-cols-[1fr_58px_50px_50px] grid-cols-[1fr_45px_50px_45px]"
    >
        <button className={className + ' sm:rounded-r-md rounded-l-md '}
            onClick={() => onChange(formatValue(value + 1))}
        >{name}</button>
        <button className={className + ' sm:rounded-l-md sm:ml-[8px] border-r-0'}
            onClick={() => onChange(formatValue(value - 1))}
        >-</button>
        <button className={className}>
            <input
                type="number" id="useType" name="name" className="text-center placeholder:text-slate-400 block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-black focus:outline-none"
                value={value === 0 ? '' : value}
                placeholder='0'
                onChange={e => {
                    const value = e.target.value
                    if (value == '') return onChange(0)
                    onChange(formatValue(parseInt(value)))
                }}
            />
        </button>
        <button className={className + ' rounded-r-md border-l-0'}
            onClick={() => onChange(formatValue(value + 1))}
        >+</button>
    </div>
}

