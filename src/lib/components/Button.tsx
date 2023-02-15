// React Button with tailwind that extends html button

import classNames from 'classnames'

export default function Button({ className, children, ...props }: React.ComponentProps<'button'>) {
    return <button className={classNames(
        'inline-flex items-center px-3 py-1 shadow justify-center align-middle',
        'text-center text-sm font-medium rounded-md',
        'text-white bg-gray-900 hover:bg-gray-800',
        className
    )}
        {...props}
    >
        {children}
    </button>
}
