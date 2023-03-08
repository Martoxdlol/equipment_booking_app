import type { ElegibleTime } from "@prisma/client";
import classNames from "classnames";
import Image from "next/image";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Switch from "./Switch";

type Props = {
    value: ElegibleTime,
    onChange?: (value: { minutes: number, hours: number, }) => void
    addMode?: false | null | undefined
    onAdd?: () => unknown
    onSetEnabled?: (enabled: boolean) => unknown
    onRemove?: () => unknown
} | {
    value: { minutes: number, hours: number, },
    onChange: (value: { minutes: number, hours: number, }) => void
    onAdd?: () => unknown
    onSetEnabled?: (enabled: boolean) => unknown
    onRemove?: () => unknown
    addMode: true
}

function fillZeros(num: number) {
    return num.toString().padStart(2, '0');
}

export default function ElegibleTimeOption({ value, onChange, addMode, onAdd, onRemove, onSetEnabled }: Props) {

    if (addMode) {

        return <div className="rounded-full border px-1 py-0.5 text-center inline-flex gap-1 items-center">
            <input
                placeholder="23"
                value={value.hours || ''} onChange={e => onChange({ minutes: value.minutes, hours: parseInt(e.target.value) })}
                type="number" className="text-center w-[40px] bg-gray-100 rounded-md border-none outline-transparent" />
            <span>:</span>
            <input
                placeholder="59"
                value={value.minutes || ''} onChange={e => onChange({ minutes: parseInt(e.target.value), hours: value.hours })}
                type="number" className="text-center w-[40px] bg-gray-100 rounded-md border-none outline-transparent" />
            <div onClick={onAdd}>
                <Image src="/add-plus-icon.svg" width={20} height={20} alt="Agregar" />
            </div>
        </div>
    }

    return <div className={classNames("rounded-full border px-1 py-0.5 text-center flex items-center relative justify-center", {
        'opacity-50': !value.enabled
    })}>
        <b className="font-semibold">{value.hours}</b>
        <b className="px-[1px]">:</b>
        <b className="font-semibold">{fillZeros(value.minutes)}</b>
        <div className="absolute right-1 opacity-0 hover:opacity-100" onClick={onRemove}>
            <Image src="/close-red-icon.svg" width={20} height={20} alt="Eliminar" />
        </div>
        <div className="absolute left-1 opacity-0 hover:opacity-100" onClick={() => onSetEnabled && onSetEnabled(!value.enabled)}>
            <Image src={value.enabled ? '/eye-blind-icon.svg' : '/eye-icon.svg'} width={20} height={20} alt={value.enabled ? 'Deshabilitar' : 'Habilitar'} />
        </div>
    </div>
}