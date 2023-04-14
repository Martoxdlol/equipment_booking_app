import AuthedRoute from "lib/authed"
import BottomMenu from "lib/components/bottom_menu/bottom_menu"
import Scaffold from "lib/components/scaffold/scaffold"
import Container from '@mui/material/Container';
import { useCloseCurrentModal, useConfirm, useOpenModal } from "lib/modals/modals"
import MenuAppBar from "lib/components/app_bar/app_bar";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';

import { useState } from 'react'

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { removeDiacritics, stringToColor } from "utils/text_utils";
import { trpc } from "utils/trpc";

import Typography from '@mui/material/Typography';
import { useRouter } from "next/router";
import { EquipmentTypeFormModal } from ".";
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment from "moment";

export default function EquipmentAssetTypePage() {

    const openModal = useOpenModal()

    const confirm = useConfirm()

    const [assetTypes, setAssetTypes] = useState<{ id: string; title: string; }[]>([])

    const router = useRouter()

    const queryResult = trpc.assets.getAssetType.useQuery({ id: (router.query.id + '') || '' })

    const data = queryResult.data

    const deleteAssetType = trpc.assets.deleteAssetType.useMutation().mutateAsync
    const deleteAssets = trpc.assets.deleteAssets.useMutation().mutateAsync

    const assetsQuery = trpc.assets.getAssets.useQuery({ type: data?.id + '' })

    const [selection, setSelection] = useState(new Set<string>())

    const theme = useTheme();

    const selectedBorderColor = theme.palette.primary.light
    const normalBorderColor = "#bdbdbd"

    const selectedRequestsInfo = {} as { [key: string]: { assets: any[], data: any } }

    assetsQuery.data?.filter(asset => selection.has(asset.id) && asset.deployed_to).map(asset => {
        const id = asset.deployed_to!.request_id!.toString()
        if (!selectedRequestsInfo[id]) selectedRequestsInfo[id] = { assets: [], data: {} }
        selectedRequestsInfo[id].assets.push(asset)
        selectedRequestsInfo[id].data = asset.deployed_to!
    })

    const selectedRequestsInfoList = Object.values(selectedRequestsInfo)

    return <AuthedRoute>
        <Scaffold
            topHeight="76px"
            top={<MenuAppBar />}
            bottom={<BottomMenu />}
        >
            <Container maxWidth="xl">
                {(queryResult.isFetching && !data) && <Typography fontSize={22}>Cargando...</Typography>}

                {data && <Typography fontSize={22}>
                    {data.title}
                </Typography>}

                <Box paddingTop={1}>
                    <Grid container spacing={1}>
                        {data?.id && assetsQuery.data?.map(asset => {


                            const timeCompleted = (asset.deployed_to && asset.deployed_to.time_end.getTime() < Date.now())


                            let returnText = moment(asset.deployed_to?.time_end).fromNow().replace('en', 'restan')

                            if (timeCompleted) {
                                returnText = 'no devolvió'
                            }

                            return <Grid item xs={6} sm={4} lg={3} xl={2} key={asset.id} style={{ position: 'relative' }}>

                                {selection.has(asset.id) && <Checkbox checked
                                    style={{
                                        color: selectedBorderColor,
                                        position: 'absolute',
                                        left: '-4px',
                                        top: '-4px',
                                    }} />}


                                {asset.deployed_to && <p
                                    style={{
                                        fontSize:'12px',
                                        color: '#999',
                                        position: 'absolute',
                                        right: '6px',
                                        top: '10px',
                                    }}>#{asset.deployed_to.request_id}</p>}


                                <Button fullWidth sx={{ height: '60px' }} style={{ border: '2px solid ' + (selection.has(asset.id) ? selectedBorderColor : normalBorderColor), position: 'relative' }}
                                    onMouseMove={(e) => {
                                        if (e.buttons && !selection.has(asset.id)) {
                                            const s = new Set(selection)
                                            s.add(asset.id)
                                            setSelection(s)

                                        }
                                    }}
                                    onClick={() => {
                                        const s = new Set(selection)
                                        if (s.has(asset.id)) {
                                            s.delete(asset.id)
                                        } else {

                                            s.add(asset.id)
                                        }
                                        setSelection(s)
                                    }}
                                >

                                    {timeCompleted &&
                                        <HourglassDisabledIcon
                                            fontSize={'12px' as any}
                                            color="error"
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                            }} />
                                    }


                                    <Box style={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        <Typography>
                                            {asset.id}
                                        </Typography>
                                        <Typography fontSize={12} textTransform='none' fontWeight={700} color={asset.deployed_to ? stringToColor(asset.deployed_to.email) : undefined}>
                                            {asset.deployed_to && <span><span>{asset.deployed_to.name} - </span>
                                                <span style={{ color: timeCompleted ? '#d32f2f' : 'inherited' }}>{returnText}</span>
                                            </span>}
                                        </Typography>
                                    </Box>
                                </Button>
                            </Grid>
                        })}
                        <Grid item xs={6} sm={4} lg={3} xl={2} style={{ position: 'relative' }} key='new'>
                            <Button fullWidth sx={{ height: '60px' }} variant='outlined' onClick={() => openModal(<SetAssetModal type={data?.id!} onSave={assetsQuery.refetch} />)}>
                                <AddIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {!!selection.size && <Box paddingTop={2}>
                    <Paper elevation={2}>
                        <DialogTitle>Equipos</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {selection.size} seleccionados
                            </DialogContentText>
                            {!!selectedRequestsInfoList.length && <DialogContentText paddingTop={1}>
                                Pedidos selecionados
                            </DialogContentText>}

                            {selectedRequestsInfoList.map(request => {
                                const timeStart = moment(request.data.time_start)
                                const timeEnd = moment(request.data.time_end)
                                // const timeEnd = moment(request.data.time_end)
                                return <Box paddingBottom={1} paddingTop={0} borderTop="1px solid #f1f1f1">
                                    <p><span style={{color: '#999'}}>#{request.data.request_id}</span> {timeStart.format('ddd D MMM HH:mm') + ' - ' + timeEnd.format('HH:mm')}</p>
                                    <p>{request.data.name} - {request.assets.length} equipos</p>
                                </Box>
                            })}
                        </DialogContent>
                        <DialogActions>
                            <Button color="error"
                                onClick={() => {
                                    confirm({ title: '¿Seguro quiere eliminar?', details: 'Se eliminaran los equipos seleccionados' }).then(async r => {
                                        if (r && data) {
                                            await deleteAssets(Array.from(selection))
                                            assetsQuery.refetch()
                                        }
                                    })
                                }}
                            >Eliminar</Button>
                            <Button>Devolver</Button>
                            <Button>Entregar</Button>
                        </DialogActions>
                    </Paper>
                </Box>}

                {/* 
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => openModal(<EquipmentTypeFormModal id={data?.id} name={data?.title} onSave={queryResult.refetch} />)}>Modificar</Button>
                    <Button color="error"
                        onClick={() => {
                            confirm({ title: '¿Seguro quiere eliminar?' }).then(async r => {
                                if (r && data) {
                                    await deleteAssetType({ id: data.id })
                                    router.push('/equipment')
                                }
                            })
                        }}
                    >Eliminar</Button>
                </ButtonGroup>
                <Box paddingTop={1}>

                    {data && <Typography fontSize={16}>
                        Lista de equipos
                    </Typography>}
                </Box>

                <ButtonGroup variant="outlined" aria-label="outlined button group">

                    <Button onClick={() => openModal(<SetAssetModal type={data?.id!} onSave={assetsQuery.refetch} />)}>Agregar</Button>
                    <Button color="error" disabled={!selection.size}
                        onClick={() => {
                            confirm({ title: '¿Seguro quiere eliminar?' }).then(async r => {
                                if (r && data) {
                                    await deleteAssets(Array.from(selection))
                                    assetsQuery.refetch()
                                }
                            })
                        }}
                    >Eliminar</Button>

                </ButtonGroup>

                <Box paddingTop={1}>
                    {data?.id && <DataGrid
                        rows={assetsQuery.data || []}
                        columns={columns}
                        // pageSize={5}
                        // rowsPerPageOptions={[5]}
                        checkboxSelection
                        autoHeight
                        selectionModel={Array.from(selection)}
                        getRowId={d => d.id}
                        onSelectionModelChange={(s) => setSelection(new Set(s.map(t => t.toString())))}
                    />}
                </Box>
 */}

            </Container>
        </Scaffold>
    </AuthedRoute >

}



const columns: GridColDef[] = [
    { field: 'id', headerName: 'Asset TAG', width: 180 },
    {
        field: 'deployed_to_name',
        headerName: 'Entregado a',
        // description: 'This column has a value getter and is not sortable.',
        // sortable: false,
        width: 180,
        valueGetter: (params: GridValueGetterParams) => params.row.deployed_to?.name || '',
    },
    {
        field: 'date', headerName: 'Fecha', width: 100,
        valueGetter: (params: GridValueGetterParams) => params.row.deployed_to?.time_start ? moment(params.row.deployed_to?.time_start).format('DD/MM/YYYY') : '',
    },
    {
        field: 'time_start', headerName: 'Desde', width: 70,
        valueGetter: (params: GridValueGetterParams) => params.row.deployed_to?.time_start ? moment(params.row.deployed_to?.time_start).format('HH:mm') : '',
    },
    {
        field: 'time_end', headerName: 'Hasta', width: 70,
        valueGetter: (params: GridValueGetterParams) => params.row.deployed_to?.time_end ? moment(params.row.deployed_to?.time_end).format('HH:mm') : '',
    },
    // { field: 'firstName', headerName: 'First name', width: 130 },
    // { field: 'lastName', headerName: 'Last name', width: 130 },
    // {
    //     field: 'age',
    //     headerName: 'Age',
    //     type: 'number',
    //     width: 90,
    // },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params: GridValueGetterParams) =>
    //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
];

export function SetAssetModal(props: { id?: string, type: string, onSave?: () => void }) {
    const closeModal = useCloseCurrentModal()

    const [id, setId] = useState(props.id || '')

    const [error, setError] = useState('')

    const createAsset = trpc.assets.setAsset.useMutation()

    async function save() {
        const result = await createAsset.mutateAsync({ id, type: props.type })

        console.log(result)

        if (result?.error) {
            setError(result.error)
        } else {
            props.onSave && props.onSave()
            closeModal()
        }
    }

    return <>
        <DialogTitle>Agregar equipo</DialogTitle>
        <DialogContent>
            {error && <DialogContentText color={'red'}>
                {error}
            </DialogContentText>}
            {/* <DialogContentText>
                Tag del equipo
            </DialogContentText> */}
            <TextField
                value={id}
                onChange={e => setId(e.target.value)}
                autoFocus
                id="name"
                label="Tag del equipo"
                type="text"
                fullWidth
                variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={closeModal}>Cancelar</Button>
            <Button onClick={save}>Guardar</Button>
        </DialogActions>
    </>
}