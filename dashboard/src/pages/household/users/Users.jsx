import { sentenceCase } from 'change-case';
import { useState } from 'react';
import useSWR from 'swr'
import { HOST_URL } from '../../../config/settings';
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
  Avatar,
  Box,
  Button
} from '@mui/material';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import { UserListHead } from '../../../sections/@dashboard/user';
//
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------
import { useParams } from 'react-router-dom';

const TABLE_HEAD = [
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'is_admin', label: 'Is Admin', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone_number', label: 'Phone Number', alignRight: false },
  { id: 'firstname', label: 'First Name', alignRight: false },
  { id: 'lastname', label: 'Last Name', alignRight: false },
  { id: 'last_login', label: 'Last Login', alignRight: false },
  { id: 'created', label: 'Date Added', alignRight: false },
];

// ----------------------------------------------------------------------

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function NewsSubscribers() {
  let { orgslug } = useParams();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date_updated');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("")
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const { data } = useSWR(`${HOST_URL}organisation/${orgslug}/users/?limit=${rowsPerPage}&offset=${page * rowsPerPage}&search=${search}&ordering=${(order === 'desc' ? "-" : "") + orderBy}`, fetcher)
  return (
    <Page title="Organisation Users | HSSIOT">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Organisation Users
          </Typography>
          <Button>Add User</Button>
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
                  {data && data.results.map((row) => {
                    return (
                      <TableRow
                        hover
                        key={row.id}
                        tabIndex={-1}
                        role="checkbox"
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ paddingLeft: 1 }}>
                            <Avatar alt={row.user.username} src={row.user.user_profile.image} />
                            <Typography variant="subtitle2" noWrap>
                              {row.user.username}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.is_admin ? "True" : "False"}</TableCell>
                        <TableCell align="left">{row.user.email}</TableCell>
                        <TableCell align="left">{row.user.user_profile.phone_number}</TableCell>
                        <TableCell align="left">{sentenceCase(row.user.user_profile.firstname)}</TableCell>
                        <TableCell align="left">{sentenceCase(row.user.user_profile.lastname)}</TableCell>
                        <TableCell align="left">{row.user.last_login ? new Date(Date.parse(row.user.last_login)).toLocaleString() : "Never"}</TableCell>
                        <TableCell align="left">{new Date(Date.parse(row.created)).toLocaleString()}</TableCell>
                      </TableRow>)
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data && data.count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}