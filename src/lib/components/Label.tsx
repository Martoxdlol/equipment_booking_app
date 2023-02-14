import React from "react";
import classNames from 'classnames'

const defaultClasses = 'block text-sm font-medium text-gray-700'

export default function Label({ className, ...props }: React.ComponentProps<'label'>) {
    return <label className={classNames(defaultClasses, className)} {...props}/>
}