import { useState } from 'react';
import useSWR from 'swr'
import { HOST_URL } from '../../config/settings';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
// material
import {
    Card,
    Table,
    Stack,
    TableBody,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    OutlinedInput,
    InputAdornment,
    Box,
    TableCell,
    TableRow
} from '@mui/material';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { UserListHead } from '../../sections/@dashboard/user';
//
import Iconify from '../../components/Iconify';
import { fNumber } from '../../utils/formatNumber';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'value', label: 'Gas Value', alignRight: false },
    { id: '', label: 'Status', alignRight: false },
    { id: 'date_created', label: 'Date Recorded', alignRight: false },
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

const token = localStorage.getItem('token')?.toString()
const config = {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Authorization': 'Token ' + token
    }
}
// ----------------------------------------------------------------------
const fetcher = (url: string) => fetch(url, config).then(res => res.json())

export default function GasSensor() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date_updated');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState("")
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
    let { householdslug } = useParams();
    const { data } = useSWR(`${HOST_URL}household/${householdslug}/device/?resourcetype=GasSensorReading`, fetcher)
    return (
        <Page title="Gas Sensor | HSSIOT">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Gas Sensor Readings
                    </Typography>
                </Stack>

                <Card>
                    <Box sx={{ padding: 2 }}>
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
                                                <TableCell align="left">{fNumber(row.value)}</TableCell>
                                                <TableCell align="left">High</TableCell>
                                                <TableCell align="left">{new Date(Date.parse(row.date_created)).toLocaleString()}</TableCell>
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
        </Page>
    );
}