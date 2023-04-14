import AuthedRoute from "lib/authed";
import Container from '@mui/material/Container';
import AppBar from "lib/components/app_bar/app_bar";
import Scaffold from "lib/components/scaffold/scaffold";
import BottomMenu from "lib/components/bottom_menu/bottom_menu";
import TextField from '@mui/material/TextField/TextField'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TimeRangePicker from 'lib/pickers/time_range_picker';
import { useState } from 'react'


import Autocomplete from '@mui/material/Autocomplete/Autocomplete'

import DatePicker from 'lib/pickers/date_picker';
import WeeklyRecurrencyPicker from 'lib/pickers/recurrency_picker';
import EquipmentPicker from 'lib/pickers/equipment_picker';
import { trpc } from "utils/trpc";
import moment from "moment";
import UserPircker from "lib/pickers/user_picker";

export default function EquipmentRequestForm() {
    const [timeRange, setTimeRange] = useState<[number | null, number | null] | null>([null, null])
    const [date, setDate] = useState<Date | number | null>(null)
    const [repeatExtraWeeksQty, setRepeatExtraWeeksQty] = useState<number>(0)
    const [requestedBy, setRequestedBy] = useState<string | null>(null)


    let timeStart: Date | null = null
    let timeEnd: Date | null = null
    if (timeRange && timeRange[0] && timeRange[1]) {
        timeStart = moment(date).add(timeRange[0], 'milliseconds').toDate()
        timeEnd = moment(date).add(timeRange[1], 'milliseconds').toDate()
    }

    const { data: user } = trpc.users.currentUser.useQuery()

    const makeRequest = trpc.equipmentRequests.makeRequest.useMutation().mutateAsync

    const isValid = timeStart && timeEnd && timeStart < timeEnd

    return <AuthedRoute>
        <Scaffold
            top={<AppBar />}
            bottom={<div
                style={{
                    boxShadow: '0 1px 10px -3px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    margin: 'auto',
                }}
            >
                <Button variant="contained" fullWidth>Guardar pedido</Button>
                <BottomMenu />
            </div>}
            topHeight="86px"
            bottomHeight="92px"
        >
            <Container maxWidth="xl">
                <form>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <UserPircker disabled={!user?.adminLevel} onChange={setRequestedBy} value={requestedBy} />
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <Autocomplete
                                    disablePortal
                                    id="where"
                                    options={[
                                        { label: 'Tomás Cichero', id: 'tcichero' },
                                        { label: 'Sebastián Cerezo', id: 'scerezo' },
                                    ]}
                                    renderInput={(params) => <TextField variant='filled' {...params} label="Donde se va a usar" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TimeRangePicker value={timeRange} onValueChange={setTimeRange} options={[
                                    1000 * 60 * 60 * 7.5,
                                    1000 * 60 * 60 * 8.5,
                                    1000 * 60 * 60 * 9.5,
                                    1000 * 60 * 60 * 10.5,
                                    1000 * 60 * 60 * 11.5,
                                    1000 * 60 * 60 * 12.5,
                                    1000 * 60 * 60 * 13.5,
                                    1000 * 60 * 60 * 14.5,
                                    1000 * 60 * 60 * 15.5,
                                    1000 * 60 * 60 * 16.5,
                                ]} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker value={date} onValueChange={setDate} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <WeeklyRecurrencyPicker initialDate={date ? new Date(date) : null} value={repeatExtraWeeksQty} onValueChange={setRepeatExtraWeeksQty} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <EquipmentPicker />
                            </Grid>
                        </Grid>
                    </Box>
                </form >
                <Button onClick={() => {
                    if (isValid) {
                        makeRequest({
                            time_start: timeStart as any,
                            time_end: timeEnd as any,
                            makeRecurrentUntil: new Date(),
                            requested_by: requestedBy as any
                        })
                    }
                }}>
                    Crear
                </Button>
            </Container>
        </Scaffold>
    </AuthedRoute>
}