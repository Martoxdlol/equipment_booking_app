import type { ElegibleTime } from "@prisma/client";
import classNames from "classnames";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Switch from "./Switch";

type Props = {
    value: ElegibleTime,
    onChange?: (value: { minutes: number, hours: number, }) => void
    addMode?: false | null | undefined
    onAdd?: () => unknown
} | {
    value: { minutes: number, hours: number, },
    onChange: (value: { minutes: number, hours: number, }) => void
    onAdd?: () => unknown
    addMode: true
}

export default function ElegibleTimeOption({ value, onChange, addMode, onAdd }: Props) {
    return <div className={classNames("my-1", {'my-3': !addMode})}>
        <div className="grid grid-cols-2">
            {addMode && <>
                <Input placeholder="Hora" type="number" className="rounded-none rounded-l-md" value={value.hours} onChange={e => onChange({ minutes: value.minutes, hours: parseInt(e.target.value) })} />
                <Input placeholder="Minutos" type="number" className="rounded-none rounded-r-md" value={value.minutes} onChange={e => onChange({ minutes: parseInt(e.target.value), hours: value.hours })} />
            </>}
            {!addMode && <>
                <div className="px-1 text-center rounded-l-md bg-gray-600 text-white text-right border-r-white">{value.hours} &nbsp;:</div>
                <div className="text-center rounded-r-md bg-gray-600 text-white text-start border-l-white">{value.minutes}</div>
            </>}
        </div>
        {!addMode && <div className="flex gap-1">
            <Label className="cursor-pointer text-red-500">Eliminar</Label>
            <Label className="cursor-pointer text-blue-500">Activado: si</Label>
            <Label className="cursor-pointer text-gray-500">(20 pedidos - 10 pedidos)</Label>
        </div>}
        {addMode && <div className="flex gap-1">
            <Label className="cursor-pointer text-blue-500" onClick={onAdd}>Agregar</Label>
        </div>}
    </div>
}