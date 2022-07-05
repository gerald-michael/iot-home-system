import { useState } from 'react';
import useSWR from 'swr'
import { HOST_URL } from '../../config/settings';
import { styled } from '@mui/material/styles';
// material
import {
    Card,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    OutlinedInput,
    InputAdornment,
    Box,
    Chip,
    IconButton,
    Button
} from '@mui/material';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { UserListHead } from '../../sections/@dashboard/user';
//
import Iconify from '../../components/Iconify';
import { Can } from '../../store/context/permissions';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import DownloadForm from './DownloadForm';
// ----------------------------------------------------------------------
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const TABLE_HEAD = [
    { id: 'phone_number', label: 'Phone Number', alignRight: false },
    { id: 'message', label: 'Message', alignRight: false },
    { id: 'slno', label: 'SLNO', alignRight: false },
    { id: 'entity_num', label: 'Entity Num', alignRight: false },
    { id: 'sms_type', label: 'Sms Type', alignRight: false },
    { id: 'created_date', label: 'Created Date', alignRight: false },
    { id: 'account_no', label: 'Account Number', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'date', label: 'Sms Out Date', alignRight: false },
    { id: 'delivery_status', label: 'Delivery Status', alignRight: false },
    { id: 'message_id', label: 'Message Id', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '& fieldset': {
        borderWidth: `1px !important`,
    }
}));

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function SmsList() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date_updated');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event: any) => {
        setSearch(event.target.value);
    };
    const { data } = useSWR(`${HOST_URL}sms/?limit=${rowsPerPage}&offset=${page * rowsPerPage}&search=${search}&ordering=${(order === 'desc' ? "-" : "") + orderBy}`, fetcher)
    return (
        <Can permissions={"can_view_sms"}>
            <Page title="Sms List | HFB">
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Sms
                        </Typography>
                    </Stack>

                    <Card>
                        <Box sx={{ padding: 2 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                                <SearchStyle
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search..."
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    }
                                />
                                <Button endIcon={<DownloadIcon />} onClick={handleOpen}>
                                    Download
                                </Button>
                            </Stack>
                        </Box>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {data && data.results.map((row: any) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={row.id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                >
                                                    <TableCell align="left">{row.phone_number}</TableCell>
                                                    <TableCell align="left">{row.message}</TableCell>
                                                    <TableCell align="left">{row.slno}</TableCell>
                                                    <TableCell align="left">{row.entity_num}</TableCell>
                                                    <TableCell align="left">{row.sms_type}</TableCell>
                                                    <TableCell align="left">{row.created_date}</TableCell>
                                                    <TableCell align="left">{row.account_no}</TableCell>
                                                    <TableCell align="left">{row.status}</TableCell>
                                                    <TableCell align="left">{row.date}</TableCell>
                                                    <TableCell align="left"><Chip label={row.delivery_status} color={row.delivery_status === 'DELIVERED' ? 'success' : row.delivery_status === 'PENDING' ? 'warning' : "error"} /></TableCell>
                                                    <TableCell align="left">{row.message_id}</TableCell>
                                                    <Can permissions={"view_historicalsmsout"}>
                                                        <TableCell align="right">
                                                            <IconButton onClick={() => {
                                                                navigate(`${row.id}/`)
                                                            }}>
                                                                <HistoryIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </Can>
                                                </TableRow>)
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                        {data && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={data && data.count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        )}
                    </Card>
                </Container>
                <StyledModal
                    open={open}
                    onClose={handleClose}
                    BackdropComponent={Backdrop}
                >
                    <DownloadForm close={handleClose} />
                </StyledModal>
            </Page>
        </Can>
    );
}