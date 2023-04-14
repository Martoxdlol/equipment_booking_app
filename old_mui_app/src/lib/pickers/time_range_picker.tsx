import { useCloseCurrentModal, useOpenModal } from "lib/modals/modals";
import Paper from '@mui/material/Paper';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useRef, useLayoutEffect, useState } from 'react'

import styles from './pickers.module.css'
import moment from "moment";
import PickerButton from "./picker_button";

export default function TimeRangePicker({ options, onValueChange, value }: TimeRangePickerProps) {
    const openModal = useOpenModal()

    // return <Button variant="contained" sx={{ height: 70, width: '100%', backgroundColor: 'white', color: 'black' }}>Rango horario</Button>

    const [start, end] = value || [null, null]
    const isValid = start && end && end > start

    return <PickerButton
        startIcon={<ScheduleIcon />}
        showWarning={!isValid}
        onClick={() => {
            openModal(<PickerModal
                options={options}
                value={value || [null, null]}
                onValueChange={onValueChange}
            />)
        }}>
        {isValid && <>
            {moment().startOf('day').add(start).format('HH:mm')}
            {' - '}
            {moment().startOf('day').add(end).format('HH:mm')}
            {' '}
            ({Math.round((end - start) / (1000 * 60 * 60)).toFixed(0)} horas)
        </>}
        {!isValid && "Horario"}
    </PickerButton>
}

interface TimeRangePickerProps {
    options: number[],
    value: [number | null, number | null] | null,
    onValueChange: (value: TimeRangePickerProps['value']) => void
}

function PickerModal({ options, onValueChange, value }: TimeRangePickerProps) {
    const closeModal = useCloseCurrentModal()

    const gridRef = useRef<HTMLDivElement | null>(null)
    const joinRef = useRef<HTMLDivElement | null>(null)
    const svgRef = useRef<SVGSVGElement | null>(null)
    const svgRect1ref = useRef<SVGRectElement | null>(null)
    const svgRect2ref = useRef<SVGRectElement | null>(null)
    const svgRect3ref = useRef<SVGRectElement | null>(null)


    const [start, setStart] = useState<number | null>(value![0])
    const [end, setEnd] = useState<number | null>(value![1])


    const isValid = start && end && end > start

    useLayoutEffect(() => {
        const height = (gridRef.current?.offsetHeight || 16) - 16
        const width = gridRef.current?.offsetWidth || 0
        const joinWidth = 50
        const left = (width - joinWidth) / 2
        if (height && joinRef.current && isValid) {

            const singleHeight = height / options.length

            const startIndex = options.indexOf(start)
            const endIndex = options.indexOf(end)

            const startY = singleHeight / 2 + singleHeight * startIndex
            const endY = singleHeight / 2 + singleHeight * endIndex


            joinRef.current.style.display = 'block'
            joinRef.current.style.left = left + 'px'

            svgRef.current!.setAttribute('viewBox', '0 0 50 ' + endY)
            svgRef.current!.setAttribute('height', endY.toString())

            svgRect2ref.current!.setAttribute('y', startY.toString())
            svgRect2ref.current!.setAttribute('height', endY.toString())

            svgRect1ref.current!.setAttribute('y', startY.toString())
            svgRect3ref.current!.setAttribute('y', (endY - 2).toString())

        } else if (joinRef.current) {
            joinRef.current.style.display = 'none'
        }
    })

    return <>
        <DialogTitle>Rango horario</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={6} alignContent='center'>
                    <span className={styles.label}>Desde</span>
                </Grid>
                <Grid item xs={6}>
                    <span className={styles.label}>Hasta</span>
                </Grid>
            </Grid>
            <hr />
            <div ref={gridRef} className={styles.grid}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {options.map((ms, i) => {
                            return <Button
                                key={i}
                                disabled={(end || Infinity) <= ms}
                                variant={ms == start ? 'outlined' : 'text'}
                                sx={{ width: '100%' }} onClick={() => {
                                    setStart(ms)
                                }}>
                                {moment().startOf('day').add(ms).format('HH:mm')}
                            </Button>
                        })}
                    </Grid>
                    <Grid item xs={6}>
                        {options.map((ms, i) => {
                            return <Button
                                key={i}
                                variant={ms == end ? 'outlined' : 'text'}
                                sx={{ width: '100%' }} onClick={() => {
                                    setEnd(ms)
                                }}>
                                {moment().startOf('day').add(ms).format('HH:mm')}
                            </Button>
                        })}
                    </Grid>
                </Grid>
                <div className={styles.join} ref={joinRef}>
                    <svg width="50" height="120" ref={svgRef}
                        viewBox="0 0 50 120"
                        xmlns="http://www.w3.org/2000/svg">

                        <rect x="0" y="0" width="24" height="2" ref={svgRect1ref} />
                        <rect x="24" y="0" width="2" height="0" ref={svgRect2ref} />
                        <rect x="26" y="0" width="24" height="2" ref={svgRect3ref} />
                    </svg>
                </div>
            </div>
        </DialogContent>

        <DialogActions>
            <Button onClick={closeModal} sx={{ color: 'grey' }}>Cancelar</Button>
            <Button onClick={() => {
                closeModal()
                if (isValid) {
                    onValueChange([start, end])
                }
            }} disabled={!isValid}
            >Guardar</Button>
        </DialogActions>
    </>
}