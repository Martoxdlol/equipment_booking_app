import { useSession } from "next-auth/react";
import { useState } from "react";
import ComboBox from "../../../lib/components/ComboBox";
import DashboardLayout from "../../../lib/components/DashboardLayout";
import DatePicker, { Date } from "../../../lib/components/DatePicker";
import ElegibleTimePicker, { ElegibleTime } from "../../../lib/components/ElegibleTimePicker";
import Select from "../../../lib/components/Select";
import TimePicker, { Time } from "../../../lib/components/TimePicker";
import { useNamespace } from "../../../utils/hooks";

export default function DashboardNewBooking() {

    const namespace = useNamespace()
    const { data: session } = useSession()

    const [requestedBy, setRequestedBy] = useState(session?.user.id)

    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()

    const [fromTime, setFromTime] = useState<ElegibleTime>()
    const [toTime, setToTime] = useState<ElegibleTime>()

    return <DashboardLayout
        title="Nuevo pedido"
    >
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
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
                    <label htmlFor="useType" className="block text-sm font-medium text-gray-700">Donde/como se va a usar</label>
                    <button className="relative w-full mt-1 cursor-default rounded-md border border-gray-300 bg-white py-1 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                        <input type="text" id="useType" name="name" className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-black focus:outline-none" value="" />
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Desde</label>
                    <DatePicker
                        value={fromDate}
                        onChange={setFromDate}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 hidden md:block">Horario</label>
                    <ElegibleTimePicker
                        value={fromTime}
                        onChange={setFromTime}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hasta</label>
                    <DatePicker
                        value={toDate}
                        onChange={setToDate}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 hidden md:block">Horario</label>
                    <ElegibleTimePicker
                        value={toTime}
                        onChange={setToTime}
                    />
                </div>
            </div>
            <div>

            </div>
        </div>
    </DashboardLayout>
}