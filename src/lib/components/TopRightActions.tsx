import classNames from "classnames"
import Button from "./Button"

interface Props {
    actions: {
        label?: React.ReactNode
        variant?: React.ComponentProps<typeof Button>['variant'],
        onClick?: () => unknown
        className?: string
    }[]
    addPaddingToPage?: boolean
}

export default function TopRightActions(props: Props) {
    return <div className={classNames(
        'relative',
        'w-full',
        { 'h-5 md:h-0': !(props.addPaddingToPage === false) },
    )}>
        <div className="absolute top-0 right-0 flex gap-1">
            {props.actions.map((action, index) => {
                return <Button
                    key={index}
                    variant={action.variant}
                    onClick={action.onClick}
                    className={action.className}
                >{action.label}</Button>
            })}
        </div>
    </div>
}