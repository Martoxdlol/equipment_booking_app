import { useMemo } from "react";
import DashboardNamespaceRoute from "../../../lib/layouts/DashboardNamespaceRoute";
import { api } from "../../../utils/api";
import dayjs from "dayjs";
import classNames from "classnames";
import { useQueryState } from 'next-usequerystate'
import TimeRangePicker from "../../../lib/components/TimeRangePicker";
import Button from "../../../lib/components/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import { stringToColor } from "../../../lib/util/colors";
import BookingAssetIndicator from "../../../lib/components/BookingAssetIndicator";
import { useIsAdmin } from "../../../utils/hooks";
import Switch from "../../../lib/components/Switch";
import Label from "../../../lib/components/Label";
import { nameOf } from "../../../utils/names";

type Unboxed<T> =
    T extends (infer U)[]
    ? U
    : T;

export default function DashboardBookings() {
    const isAdmin = useIsAdmin()

    return <DashboardNamespaceRoute
        isAdmin={isAdmin}
    >
        {function Render({ namespace }) {

            const defaultDateStrValue = dayjs().startOf('week').format('YYYY-MM-DD')

            const [dateStr, setDateStr] = useQueryState('show-from-date', { defaultValue: defaultDateStrValue })
            const date = useMemo(() => (dateStr && dateStr != 'current') ? dayjs(dateStr) : dayjs().startOf('week'), [dateStr])
            const setDate = useMemo(() => (value: dayjs.Dayjs) => setDateStr(value.format('YYYY-MM-DD')), [setDateStr])

            const [lengthDaysStr, setLengthDaysStr] = useQueryState('time-length-days', { defaultValue: '30' })
            const lengthDays = useMemo(() => parseInt(lengthDaysStr), [lengthDaysStr])
            const setLengthDays = useMemo(() => (value: number) => setLengthDaysStr(value.toString()), [setLengthDaysStr])

            const dateTo = useMemo(() => date.add(lengthDays, 'day'), [date, lengthDays])

            const router = useRouter()

            const [poolId, setPoolId] = useQueryState('pool', { defaultValue: '' })

            const [_showHidden, setShowHidden] = useQueryState('show-hidden', { defaultValue: 'false' })
            const showHidden = useMemo(() => _showHidden == 'true', [_showHidden])

            const fn: typeof api.bookings.getAll = (isAdmin ? api.bookings.getAllAsAdmin : api.bookings.getAll) as unknown as typeof api.bookings.getAll

            const { data: _bookings } = fn.useQuery({
                showHidden: showHidden,
                poolId: poolId ? poolId : undefined,
                from: (!poolId || (router.query['show-from-date'] && router.query['time-length-days'])) ? {
                    date: {
                        year: date.year(),
                        month: date.month() + 1,
                        day: date.date(),
                    }
                } : undefined,
                to: (!poolId || (router.query['show-from-date'] && router.query['time-length-days'])) ? {
                    date: {
                        year: dateTo.year(),
                        month: dateTo.month() + 1,
                        day: dateTo.date(),
                    }
                } : undefined,
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

            const _dates = useMemo(() => {
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
                    const month = now.get('month') + 1
                    const day = now.get('date')

                    if (booking.to.date.day) {
                        if (booking.to.date.year > year) return false
                        if (booking.to.date.year === year && booking.to.date.month > month) return false
                        if (booking.to.date.year === year && booking.to.date.month === month && booking.to.date.day >= day) return false
                    }
                    return booking.inUseAssets.length > 0
                })
            }, [bookings])

            const dates = useMemo(() => {
                return ['pending', ..._dates]
            }, [_dates])

            bookingsByFromDateId.set('pending', pendingBookings)

            const firstBooking = bookings[0] || null

            const isTodayOnly = lengthDays === 1 && dayjs(date).startOf('day').isSame(dayjs().startOf('day'))

            return <>
                <div className="hidden print:block">
                    <h1 className="text-2xl mt-[-20px]">Lista de pedidos</h1>
                </div>
                <div className="md:flex justify-between mb-3">
                    <div className={classNames({
                        'print:hidden': isTodayOnly
                    })}>
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
                    </div>
                    <div className="mt-7 flex print:hidden">
                        <Button className="w-full md:w-auto ml-1"
                            variant="outlined"
                            onClick={() => {
                                print()
                            }}
                        >
                            <Image src="/printer.png" height={16} width={16} alt="Imprimir" />
                        </Button>
                        {!isTodayOnly && <Button className="w-full md:w-auto ml-1" variant="outlined"
                            onClick={() => {
                                void setDate(dayjs()).then(() => void setLengthDays(1))

                            }}
                        >Solo hoy</Button>}
                        {isTodayOnly && <Button className="w-full md:w-auto ml-2" variant="outlined"
                            onClick={() => {
                                void setDateStr(defaultDateStrValue).then(() => void setLengthDays(30))
                            }}
                        >Esta semana</Button>}
                        <Button className="w-full md:w-auto ml-1"
                            onClick={() => {
                                void router.push(`/${namespace.slug}/bookings/new`)
                            }}
                        >Nuevo</Button>
                    </div>
                </div>
                {(poolId && firstBooking) && <div className="shadow-sm border rounded-md p-2 flex justify-between">
                    <p>Viendo pedido recurrente</p>
                    <p className="text-blue-500 font-semibold cursor-pointer"
                        onClick={() => {
                            void setPoolId(null)
                        }}
                    >CERRAR</p>
                    {/* firstBooking */}
                </div>}
                <div>
                    {dates.map(dateId => {
                        const date = datesById.get(dateId)
                        const bookings = bookingsByFromDateId.get(dateId)

                        if (bookings === undefined || bookings?.length === 0) return null

                        let isBefore = false
                        let isToday = false
                        let txt = "Pedidos pendientes"
                        const isPending = dateId === 'pending'

                        if (date) {
                            const asDate = dayjs(`${date.year}-${date.month}-${date.day}`).startOf('day')

                            isBefore = asDate.isBefore(dayjs().startOf('day').subtract(1, 'millisecond'))
                            isToday = asDate.isSame(dayjs().startOf('day'))

                            const dateAsDayjs = dayjs(`${date.year}/${date.month}/${date.day}`).startOf('day')
                            txt = dateAsDayjs.format('dddd DD/MM/YYYY')
                            if (!isToday) {
                                txt = txt[0] ? txt[0].toUpperCase() + txt.slice(1) : ''
                            }

                            if (isToday) {
                                txt = 'Hoy ' + txt
                            }
                        }



                        return <div key={dateId} className={classNames('print:shadow-none', {
                            'opacity-50': isBefore, 'rounded-md mx-[-10px] p-[10px] shadow': isToday,
                        })}>
                            <h2 className="font-semibold text-sm mb-1 mt-2">{txt}</h2>
                            <ul className={classNames([
                                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1",
                                "print:border-b-0 print:border-r-0 print:border-l-0 print:pl-0 print:border-t print:border-gray-200",
                                "print:grid print:grid-cols-2 print:gap-2"
                            ])}>
                                {bookings?.map(booking => {
                                    const start = dayjs(`${booking.from.date.year}/${booking.from.date.month}/${booking.from.date.day}`).set('hour', booking.from.time.hours).set('minute', booking.from.time.minutes)
                                    const end = dayjs(`${booking.to.date.year}/${booking.to.date.month}/${booking.to.date.day}`).set('hour', booking.to.time.hours).set('minute', booking.to.time.minutes)

                                    const isCurrent = dayjs().isBefore(end) && dayjs().isAfter(start)
                                    const nowMs = dayjs().valueOf()
                                    const startMs = start.valueOf()
                                    const endMs = end.valueOf()
                                    const progress = (nowMs - startMs) / (endMs - startMs)

                                    const isPast = isToday && progress > 1
                                    const isTodayPending = isPast && booking.inUseAssets.length > 0
                                    const isCompleted = isPast && booking.inUseAssets.length === 0

                                    return <li key={booking.id}
                                        tabIndex={bookings.indexOf(booking)}
                                        className={classNames("block p-1 border rounded-md shadow-sm relative overflow-hidden",
                                            "print:border-none print:shadow-none print:pt-1 print:pl-0 print:pb-0 print:pr-0 print:rounded-none print:break-inside-avoid",
                                            "focus-within:ring-2 focus-within:border-blue-500 outline-none", {
                                            'border-blue-500': isCurrent && !(isPending && isTodayPending),
                                            'focus:ring-red-200 focus:border-red-500 border-red-500': isPending || isTodayPending,
                                            'opacity-50': isCompleted,
                                        })}
                                        onClick={() => {
                                            void router.push(`/${namespace.slug}/bookings/${booking.id}`)
                                        }}
                                    >
                                        {isCurrent && <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500 w-2 print:hidden" style={{ 'width': `${progress * 100}%` }}></div>}
                                        <p className="font-semibold text-sm">{nameOf(booking.user)} {isCompleted && '(terminado)'}</p>
                                        <BookingTimeRangeRender from={booking.from} to={booking.to} />
                                        <div className=" font-semibold text-xs text-blue-500">
                                            {booking.useType && <p>{booking.useType}</p>}
                                            {booking.comment && <p className="text-gray-500">{booking.comment}</p>}
                                        </div>
                                        <BookingAssetIndicator
                                            inUse={((!isToday || isPast) && !booking.inUseAssets.length) ? undefined : booking.inUseAssets}
                                            equipment={booking.equipment}
                                        />
                                        <div
                                            onClick={e => {
                                                e.stopPropagation()
                                                if (!booking.poolId) return;
                                                void setPoolId(booking.poolId)
                                            }}
                                            className="absolute top-[3px] right-[4px] h-[12px] w-[24px] rounded-full bg-blue-500 flex justify-around cursor-pointer"
                                            style={{ backgroundColor: stringToColor(booking.poolId ?? booking.userId) }}
                                        >
                                            {booking.poolId && <Image alt="icon" src="/link.svg" width={14} height={14} />}
                                        </div>
                                        {booking.directDeploy && <div
                                            onClick={e => {
                                                e.stopPropagation()
                                                alert('"D" es por "Entregado directamente", lo que significa que este pedido se creó desde la sección de "Deploy" y no se había reservado previamente.')
                                            }}
                                            className="absolute top-[3px] right-[31px] h-[12px] w-[24px] rounded-full bg-blue-500 flex justify-around cursor-pointer"
                                        >
                                            <span className="font-extrabold text-white text-[8px]">D</span>
                                        </div>}
                                    </li>
                                })}
                            </ul>
                        </div>
                    }).filter(Boolean)}
                </div>
                <div className="mt-2 max-w-[200px]">
                    <Label>Mostrar ocultos</Label>
                    <Switch
                        value={showHidden}
                        onChange={v => setShowHidden(v.toString())}
                    />
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