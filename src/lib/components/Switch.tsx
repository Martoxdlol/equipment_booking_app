import classNames from "classnames"

const className = "font-semibold mt-1 cursor-default border border-gray-300 py-1 px-1 text-center text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"

export default function Switch(props: {
    offLabel?: React.ReactNode
    onLabel?: React.ReactNode
    value?: boolean
    onChange?: (value: boolean) => void
    clsasName?: string
}) {
    return <div
        className={classNames("grid grid-cols-2", props.clsasName)}
    >
        <button
            onClick={() => props.onChange && props.onChange(false)}
            className={classNames(className, 'rounded-l-md border-r-0', { 'bg-indigo-500 text-white': !props.value })}>{props.offLabel || 'No'}</button>
        <button
            onClick={() => props.onChange && props.onChange(true)}
            className={classNames(className, 'rounded-r-md border-l-0', { 'bg-indigo-500 text-white': props.value })}>{props.onLabel || 'Si'}</button>
    </div >
}

