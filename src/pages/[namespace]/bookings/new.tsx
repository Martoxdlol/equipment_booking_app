import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AssetTypeQtyPicker from "../../../lib/components/AssetTypeQtyPicker";
import ComboBox from "../../../lib/components/ComboBox";
import DashboardLayout from "../../../lib/components/DashboardLayout";
import type { Date } from "../../../lib/components/DatePicker";
import DatePicker from "../../../lib/components/DatePicker";
import type { ElegibleTime } from "../../../lib/components/ElegibleTimePicker";
import ElegibleTimePicker from "../../../lib/components/ElegibleTimePicker";
import Input from "../../../lib/components/Input";
import Label from "../../../lib/components/Label";
import { useNamespace } from "../../../lib/components/NamespaceProvider";
import RecurrencyPicker from "../../../lib/components/RecurrencyPicker";
import Switch from "../../../lib/components/Switch";

export default function DashboardNewBooking() {

    const namespace = useNamespace()
    const { data: session } = useSession()

    const [requestedBy, setRequestedBy] = useState(session?.user.id)

    useEffect(() => {
        if (!requestedBy && session?.user.id) {
            setRequestedBy(session?.user.id)
        }
    }, [requestedBy, session, session?.user.id])


    const [useType, setUseType] = useState('')

    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()

    const [fromTime, setFromTime] = useState<ElegibleTime>()
    const [toTime, setToTime] = useState<ElegibleTime>()

    const [recurrencyEnabled, setRecurrencyEnabled] = useState(false)
    const [recurrency, setRecurrency] = useState(0)

    const [qty, setQty] = useState(0)

    const toDateIsSameAsFrom = !namespace?.multiDayBooking

    useEffect(() => {
        toDateIsSameAsFrom && setToDate(fromDate)
    }, [fromDate, toDateIsSameAsFrom])

    return <DashboardLayout
        title="Nuevo pedido"
    >
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="grid sm:grid-cols-1 md:grid-cols-[7fr_5fr] gap-2 mb-auto">
                <div>
                    <ComboBox
                        options={[
                            { label: session?.user.name || 'Yo', value: session?.user.id || '', picture: session?.user.image },
                        ]}
                        onChange={setRequestedBy}
                        value={requestedBy}
                        label="Pedido por"
                    />
                </div>
                <div>
                    <Label>Donde/como se va a usar</Label>
                    <Input
                        placeholder="Ejemplo: Aula 5, matemática "
                        onChange={e => setUseType(e.target.value)}
                        type="text" id="useType" name="name"
                        value={useType} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Desde</label>
                    <DatePicker
                        value={fromDate}
                        onChange={setFromDate}
                    />
                </div>
                <div>
                    <label className="sm:block text-sm font-medium text-gray-700 hidden md:block">Horario</label>
                    <ElegibleTimePicker
                        value={fromTime}
                        onChange={setFromTime}
                        maxExcludeId={toTime?.id}
                    />
                </div>

                <div className={classNames({
                    'hidden sm:block': toDateIsSameAsFrom
                })}>
                    
                    <Label>Hasta</Label>
                    <DatePicker
                        disabled={toDateIsSameAsFrom}
                        value={toDate}
                        onChange={setToDate}
                    />
                </div>
                <div>
                    {toDateIsSameAsFrom && <Label className="sm:hidden">Hasta</Label>}
                    {toDateIsSameAsFrom && <Label className="hidden sm:block">Horario</Label>}
                    {!toDateIsSameAsFrom && <Label>Horario</Label>}
                    <ElegibleTimePicker
                        value={toTime}
                        onChange={setToTime}
                        minExcludeId={fromTime?.id}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pedido recurrente</label>
                    <Switch
                        value={recurrencyEnabled}
                        onChange={setRecurrencyEnabled}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Repetir hasta (inclusive)</label>
                    <RecurrencyPicker
                        disabled={!recurrencyEnabled}
                        initialDate={fromDate}
                        vale={recurrency}
                        onChange={setRecurrency}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Elegir equipamiento</label>
                <AssetTypeQtyPicker
                    name="Notebook"
                    max={10}
                    min={0}
                    value={qty}
                    onChange={setQty}
                />

            </div>
        </div>
    </DashboardLayout>
}