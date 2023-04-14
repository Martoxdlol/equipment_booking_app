import Autocomplete from '@mui/material/Autocomplete/Autocomplete'
import { trpc } from 'utils/trpc'
import TextField from '@mui/material/TextField/TextField'

interface UserPickerProps {
    value: string | null
    disabled: boolean | undefined | null,
    onChange: (value: string | null) => void
}

export default function UserPircker({ onChange, value, disabled }: UserPickerProps) {
    const { data: users } = trpc.users.getUsers.useQuery({ filter: '' })

    return <Autocomplete
        disabled={!!disabled}
        value={value ? { label: users?.find(u => u.email === value)?.name || '', value: value } : null}
        disablePortal
        id="requested_by"
        options={users?.map(user => {
            return {
                label: user.name || user.email || '', value: user.email
            }
        }) || []}
        onChange={(event, newValue) => {
            onChange(newValue?.value || null)
        }}
        renderInput={(params) => <TextField variant='filled' {...params} label="Pedido por" />}
    />
}