interface Props {
    onConfirmDelete: () => unknown
    children?: React.ReactNode
    question?: string
}

export default function DeleteButton({ onConfirmDelete, children, question }: Props) {
    return <span
        className="cursor-pointer text-red-500 hover:text-red-600 font-semibold"
        onClick={() => {
            if (confirm(question || '¿Está seguro de eliminar este elemento?')) {
                onConfirmDelete()
            }
        }}
    >
        {children || 'Eliminar'}
    </span>
}