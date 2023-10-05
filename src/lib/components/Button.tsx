import classNames from 'classnames';

// ButtonProps extends html button:
interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
    variant?: ButtonVariantLiterals
    variants?: ButtonVariantLiterals[]
}

export const buttonVariants = {
    colored: {
        className: classNames(
            'bg-gray-900 hover:bg-gray-800',
            'text-white',
        )
    },
    outlined: { className: 'border border-gray-300 focus:border-blue-500' },
} as const

export type ButtonVariantLiterals = keyof typeof buttonVariants

export default function Button({
    variant,
    variants,
    className,
    ...props
}: ButtonProps) {

    return <button
        className={classNames([
            'border-box',
            'inline-flex',
            'items-center',
            'justify-center',
            'text-center',
            'no-underline',
            'leading-none',
            'whitespace-nowrap',
            'select-none',
            'font-semibold',
            'h-4 py-1.5 px-2',
            'rounded',
            'focus:outline-none outline-none',
            'focus:ring',
            'shadow-sm',
            { 'opacity-60': props.disabled },
            variant ? buttonVariants[variant]?.className : buttonVariants.colored.className,
            ...(variants?.map(v => buttonVariants[v]?.className) || []),
            className,
        ])}
        {...props}
    />
}