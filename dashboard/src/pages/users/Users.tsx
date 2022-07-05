import { sentenceCase } from 'change-case';
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
  Avatar,
  Box
} from '@mui/material';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { UserListHead, UserMoreMenu } from '../../sections/@dashboard/user';
//
import Iconify from '../../components/Iconify';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone_number', label: 'Phone Number', alignRight: false },
  { id: 'firstname', label: 'First Name', alignRight: false },
  { id: 'lastname', label: 'Last Name', alignRight: false },
  { id: 'last_login', label: 'Last Login', alignRight: false },
  { id: 'date_joined', label: 'Date Joined', alignRight: false },
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

export default function Users() {
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
  const { data } = useSWR(`${HOST_URL}accounts/?limit=${rowsPerPage}&offset=${page * rowsPerPage}&search=${search}&ordering=${(order === 'desc' ? "-" : "") + orderBy}`, fetcher)
  return (
    <Page title="Users | HFB">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
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
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ paddingLeft: 1 }}>
                            <Avatar alt={row.username} src={row.user_profile.image} />
                            <Typography variant="subtitle2" noWrap>
                              {row.username}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.user_profile.phone_number}</TableCell>
                        <TableCell align="left">{sentenceCase(row.user_profile.firstname)}</TableCell>
                        <TableCell align="left">{sentenceCase(row.user_profile.lastname)}</TableCell>
                        <TableCell align="left">{row.last_login ? new Date(Date.parse(row.last_login)).toLocaleString() : "Never"}</TableCell>
                        <TableCell align="left">{new Date(Date.parse(row.date_joined)).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu user_id={row.id}/>
                        </TableCell>
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