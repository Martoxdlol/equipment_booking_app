import { useMemo } from "react";
import DashboardNamespaceRoute from "../../../lib/layouts/DashboardNamespaceRoute";
import { api } from "../../../utils/api";
import dayjs from "dayjs";
import classNames from "classnames";
import { useQueryState } from 'next-usequerystate'

type Unboxed<T> =
    T extends (infer U)[]
    ? U
    : T;

export default function DashboardBookings() {
    return <DashboardNamespaceRoute>
        {function Render({ namespace }) {
            const [dateStr, setDateStr] = useQueryState('show-from-date', { defaultValue: dayjs().startOf('week').format('YYYY-MM-DD') })
            const date = useMemo(() => dayjs(dateStr), [dateStr])
            const setDate = useMemo(() => (value: dayjs.Dayjs) => setDateStr(value.format('YYYY-MM-DD')), [setDateStr])

            const [lengthDaysStr, setLengthDaysStr] = useQueryState('time-length-days', { defaultValue: '7' })
            const lengthDays = useMemo(() => parseInt(lengthDaysStr), [lengthDaysStr])
            const setLengthDays = useMemo(() => (value: number) => setLengthDaysStr(value.toString()), [setLengthDaysStr])

            

            const { data: _bookings } = api.bookings.getAll.useQuery(undefined, {
                refetchInterval: 1000 * 30,
            })

            const bookings = useMemo(() => {
                return _bookings || []
            }, [_bookings])

            const datesById = useMemo(() => {
                const map = new Map<string, Unboxed<typeof bookings>['from']['date']>()
                for (const booking of bookings) {
                    const dateId = booking.from.dateId
                    if (!map.has(dateId)) map.set(dateId, booking.from.date)
                }
                return map
            }, [bookings])

            const bookingsByFromDateId = useMemo(() => {
                const map = new Map<string, typeof bookings>()
                if (!bookings) return map
                for (const booking of bookings) {
                    const dateId = booking.from.dateId
                    if (!map.has(dateId)) map.set(dateId, [])
                    map.get(dateId)?.push(booking)
                }
                return map
            }, [bookings])

            const dates = useMemo(() => {
                const dates = [...bookingsByFromDateId.keys()]

                return dates.sort((a, b) => {
                    const aDate = datesById.get(a)
                    const bDate = datesById.get(b)
                    if (!aDate || !bDate) return 0
                    const sort1 = () => {
                        if (aDate.year > bDate.year) return 1
                        if (aDate.year < bDate.year) return -1
                        if (aDate.month > bDate.month) return 1
                        if (aDate.month < bDate.month) return -1
                        if (aDate.day > bDate.day) return 1
                        if (aDate.day < bDate.day) return -1
                        return 0
                    }

                    const asDateA = dayjs(`${aDate.year}-${aDate.month}-${aDate.day}`).startOf('day')
                    const asDateB = dayjs(`${bDate.year}-${bDate.month}-${bDate.day}`).startOf('day')

                    const now = dayjs().startOf('day').subtract(1, 'millisecond')

                    if (asDateA.isAfter(now) && !asDateB.isAfter(now)) return -1
                    if (!asDateA.isAfter(now) && asDateB.isAfter(now)) return 1

                    return sort1()
                })
            }, [bookingsByFromDateId, datesById])

            return <div>

                {dates.map(dateId => {
                    const date = datesById.get(dateId)
                    const bookings = bookingsByFromDateId.get(dateId)
                    if (date === undefined || bookings === undefined) return null

                    const asDate = dayjs(`${date.year}-${date.month}-${date.day}`).startOf('day')

                    const isBefore = asDate.isBefore(dayjs().startOf('day').subtract(1, 'millisecond'))
                    const isToday = asDate.isSame(dayjs().startOf('day'))

                    return <div key={dateId} className={classNames({ 'opacity-50': isBefore, 'rounded-md mx-[-10px] p-[10px] shadow': isToday })}>
                        <h2 className="font-semibold text-sm mb-1 mt-2">{isToday ? 'Hoy ' : ''}{date?.day}/{date?.month}/{date?.year}</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                            {bookings?.map(booking => {
                                const start = dayjs(`${booking.from.date.year}/${booking.from.date.month}/${booking.from.date.day}`).set('hour', booking.from.time.hours).set('minute', booking.from.time.minutes)
                                const end = dayjs(`${booking.to.date.year}/${booking.to.date.month}/${booking.to.date.day}`).set('hour', booking.to.time.hours).set('minute', booking.to.time.minutes)

                                const isCurrent = dayjs().isBefore(end) && dayjs().isAfter(start)
                                const nowMs = dayjs().valueOf()
                                const startMs = start.valueOf()
                                const endMs = end.valueOf()
                                const progress = (nowMs - startMs) / (endMs - startMs)

                                return <li key={booking.id} className={classNames("block p-1 border rounded-md shadow-sm relative overflow-hidden", {
                                    'border-blue-500': isCurrent
                                })}>
                                    {isCurrent && <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500 w-2" style={{ 'width': `${progress * 100}%` }}></div>}
                                    <p className="font-semibold text-sm">{booking.user.name}</p>
                                    <BookingTimeRangeRender from={booking.from} to={booking.to} />
                                    <div className="grid grid-flow-col gap-[7px] justify-start">
                                        {booking.equipment.map(equipment => {
                                            return <div
                                                key={equipment.id}
                                                className="text-xs"
                                            >{equipment.assetType.name}: <b>{equipment.quantity}</b></div>
                                        })}
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                }).filter(Boolean)}
            </div>
        }}
    </DashboardNamespaceRoute>
}

function BookingTimeRangeRender(props: {
    from: {
        date: {
            day: number
            month: number
            year: number
        },
        time: {
            hours: number
            minutes: number
        }
    }
    to: {
        date: {
            day: number
            month: number
            year: number
        },
        time: {
            hours: number
            minutes: number
        }
    }
}) {
    const start = dayjs(`${props.from.date.year}/${props.from.date.month}/${props.from.date.day}`).set('hour', props.from.time.hours).set('minute', props.from.time.minutes)
    const end = dayjs(`${props.to.date.year}/${props.to.date.month}/${props.to.date.day}`).set('hour', props.to.time.hours).set('minute', props.to.time.minutes)
    if (start.startOf('day').isSame(end.startOf('day'))) {
        return <p className="text-xs">{start.format('HH:mm')} - {end.format('HH:mm')}</p>
    } else {
        return <p className="text-xs">{start.format('HH:mm')} - {end.format('DD/MM/YYYY HH:mm')}</p>
    }
}