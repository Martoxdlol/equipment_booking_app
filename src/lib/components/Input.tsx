import React from "react";
import classNames from 'classnames'

const defaultClasses = 'placeholder:text-slate-400 block w-full flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-black focus:outline-none'

export default function Input({ type, className, ...props }: React.ComponentProps<'input'>) {
    return <input type={type || "text"} className={classNames(
        defaultClasses,
        className,
        'relative w-full mt-1 rounded-md border border-gray-300 bg-white py-1 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
    )}
        {...props}
    />
}