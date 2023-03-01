import { useMemo } from "react";
import DashboardNamespaceRoute from "../../../lib/layouts/DashboardNamespaceRoute";
import { api } from "../../../utils/api";
import dayjs from "dayjs";
import classNames from "classnames";
import { useQueryState } from 'next-usequerystate'
import TimeRangePicker from "../../../lib/components/TimeRangePicker";
import Button from "../../../lib/components/Button";
import { useRouter } from "next/router";

type Unboxed<T> =
    T extends (infer U)[]
    ? U
    : T;

export default function DashboardBookings() {
    return <DashboardNamespaceRoute>
        {function Render({ namespace }) {
            const [dateStr, setDateStr] = useQueryState('show-from-date', { defaultValue: dayjs().startOf('week').format('YYYY-MM-DD') })
            const date = useMemo(() => (dateStr && dateStr != 'current') ? dayjs(dateStr) : dayjs().startOf('week'), [dateStr])
            const setDate = useMemo(() => (value: dayjs.Dayjs) => setDateStr(value.format('YYYY-MM-DD')), [setDateStr])

            const [lengthDaysStr, setLengthDaysStr] = useQueryState('time-length-days', { defaultValue: '7' })
            const lengthDays = useMemo(() => parseInt(lengthDaysStr), [lengthDaysStr])
            const setLengthDays = useMemo(() => (value: number) => setLengthDaysStr(value.toString()), [setLengthDaysStr])

            const dateTo = useMemo(() => date.add(lengthDays, 'day'), [date, lengthDays])

            const router = useRouter()

            const { data: _bookings } = api.bookings.getAll.useQuery({
                from: {
                    date: {
                        year: date.year(),
                        month: date.month() + 1,
                        day: date.date(),
                    }
                },
                to: {
                    date: {
                        year: dateTo.year(),
                        month: dateTo.month() + 1,
                        day: dateTo.date(),
                    }
                },
            }, {
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

            const pendingBookings = useMemo(() => {
                return bookings.filter(booking => {
                    const now = dayjs().startOf('day')
                    const year = now.get('year')
                    const month = now.get('month')
                    const day = now.get('date')

                    if (booking.to.date.day) {
                        if (booking.to.date.year > year) return false
                        if (booking.to.date.year === year && booking.to.date.month > month) return false
                        if (booking.to.date.year === year && booking.to.date.month === month && booking.to.date.day > day) return false
                    }
                    return booking.inUseAssets.length > 0
                })
            }, [bookings])

            return <>
                <div className="md:flex justify-between mb-3">
                    <TimeRangePicker
                        onChange={value => {
                            const date = dayjs(`${value.from.year}-${value.from.month}-${value.from.day}`).startOf('day')
                            void setDate(date).then(() => void setLengthDays(value.duartion))
                        }}
                        value={{
                            from: {
                                year: date.year(),
                                month: date.month() + 1,
                                day: date.date(),
                            },
                            duartion: lengthDays,
                        }}
                    />
                    <div className="mt-7">
                        <Button className="w-full md:w-auto"
                            onClick={() => {
                                void router.push(`/${namespace.slug}/bookings/new`)
                            }}
                        >Nuevo</Button>
                    </div>
                </div>
                <div>
                    {dates.map(dateId => {
                        const date = datesById.get(dateId)
                        const bookings = bookingsByFromDateId.get(dateId)
                        if (date === undefined || bookings === undefined) return null

                        const asDate = dayjs(`${date.year}-${date.month}-${date.day}`).startOf('day')

                        const isBefore = asDate.isBefore(dayjs().startOf('day').subtract(1, 'millisecond'))
                        const isToday = asDate.isSame(dayjs().startOf('day'))

                        const dateAsDayjs = dayjs(`${date.year}/${date.month}/${date.day}`).startOf('day')
                        let txt = dateAsDayjs.format('dddd DD/MM/YYYY')
                        if (!isToday) {
                            txt = txt[0] ? txt[0].toUpperCase() + txt.slice(1) : ''
                        }

                        return <div key={dateId} className={classNames({ 'opacity-50': isBefore, 'rounded-md mx-[-10px] p-[10px] shadow': isToday })}>
                            <h2 className="font-semibold text-sm mb-1 mt-2">{isToday ? 'Hoy ' : ''}{txt}</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                                {bookings?.map(booking => {
                                    const start = dayjs(`${booking.from.date.year}/${booking.from.date.month}/${booking.from.date.day}`).set('hour', booking.from.time.hours).set('minute', booking.from.time.minutes)
                                    const end = dayjs(`${booking.to.date.year}/${booking.to.date.month}/${booking.to.date.day}`).set('hour', booking.to.time.hours).set('minute', booking.to.time.minutes)

                                    const isCurrent = dayjs().isBefore(end) && dayjs().isAfter(start)
                                    const nowMs = dayjs().valueOf()
                                    const startMs = start.valueOf()
                                    const endMs = end.valueOf()
                                    const progress = (nowMs - startMs) / (endMs - startMs)

                                    return <li key={booking.id}
                                        tabIndex={bookings.indexOf(booking)}
                                        className={classNames("block p-1 border rounded-md shadow-sm relative overflow-hidden",
                                            "focus-within:ring-2 focus-within:border-blue-500 outline-none", {
                                            'border-blue-500': isCurrent,
                                        })}
                                        onClick={() => {
                                            void router.push(`/${namespace.slug}/bookings/${booking.id}/change`)
                                        }}
                                    >
                                        {isCurrent && <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500 w-2" style={{ 'width': `${progress * 100}%` }}></div>}
                                        <p className="font-semibold text-sm">{booking.user.name}</p>
                                        <BookingTimeRangeRender from={booking.from} to={booking.to} />
                                        <div className="grid grid-flow-col gap-[7px] justify-start my-[2px]">
                                            {booking.equipment.map(equipment => {
                                                return <div
                                                    key={equipment.id}
                                                    className="text-xs"
                                                >{equipment.assetType.name}: <b>{equipment.quantity}</b></div>
                                            })}
                                        </div>
                                        <div className="flex font-semibold text-xs text-blue-500">
                                            {booking.useType && <p>{booking.useType}</p>}
                                            {(booking.comment && booking.useType) && <p>&nbsp;&bull;&nbsp;</p>}
                                            {booking.comment && <p>{booking.comment}</p>}
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    }).filter(Boolean)}
                </div>
            </>
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
        return <p className="text-xs font-semibold text-blue-500">{start.format('HH:mm')} - {end.format('HH:mm')}</p>
    } else {
        return <p className="text-xs font-semibold text-blue-500">{start.format('HH:mm')} - {end.format('DD/MM/YYYY HH:mm')}</p>
    }
}