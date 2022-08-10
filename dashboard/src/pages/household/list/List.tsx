import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography, Grid, List, ListItem, ListItemText, Divider, IconButton, InputAdornment, TablePagination, OutlinedInput } from '@mui/material';
// components
import Page from '../../../components/Page';
import useSWR from 'swr'
import { sentenceCase, capitalCase } from 'change-case';
import { fDateTime } from '../../../utils/formatTime';
import { useState } from 'react'
import { HOST_URL } from '../../../config/settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from "react-router-dom";
import Logo from '../../../components/Logo';
import Iconify from '../../../components/Iconify';

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    maxHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: theme.spacing(12, 0)
}));
const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320 },
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
export default function HouseholdList() {
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

    const [step, setStep] = useState<number>(0)
    const handleSearch = (event: any) => {
        setSearch(event.target.value);
    };
    const [limit, setLimit] = useState(5)
    const [ordering, setOrdering] = useState("-date_created")
    const { data } = useSWR(`${HOST_URL}household/?limit=${limit}&offset=${page * rowsPerPage}&search=${search}&ordering=${ordering}`, fetcher)
    let navigate = useNavigate();
    return (
        <RootStyle title="Household | HSSIOT">
            <Logo sx={{
                position: 'absolute',
                left: 22,
                top: 30,
                zIndex: 1
            }} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <img alt="household list" src="/static/house_searching.svg" />
                    </SectionStyle>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Container>
                        <ContentStyle>
                            <Box sx={{ mb: 5 }}>
                                <Typography variant="h4" gutterBottom>
                                    Your houses
                                </Typography>
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
                                <Typography sx={{ color: 'text.secondary' }}>
                                    Click to navigate to your houses
                                </Typography>
                                <List sx={{ width: '100%', bgcolor: 'background.paper', marginTop: 2 }} >
                                    {data ? data.results.map((item: any) => {
                                        return <Box key={item.id} sx={{ marginBottom: 2 }}>
                                            <ListItem alignItems="flex-start" sx={{ borderRadius: 10 }}>
                                                <ListItemText
                                                    primary={<>
                                                        <Typography variant='h5'>{capitalCase(item.name)}</Typography>
                                                    </>}
                                                    secondary={
                                                        <>
                                                            <Typography
                                                                sx={{ display: 'block' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"

                                                            >
                                                                {sentenceCase(item.slug)} | {fDateTime(item.created)}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <IconButton sx={{ marginY: "auto" }} onClick={() => {
                                                    navigate(`${item.slug}`, { replace: true })
                                                }} >
                                                    <ChevronRightIcon fontSize='large' />
                                                </IconButton>
                                            </ListItem>
                                            <Divider variant="middle" component="li" />
                                        </Box>
                                    }) : null}
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
                                </List>
                            </Box>
                            <Typography
                                variant="subtitle2"
                            >
                                Create an household?&nbsp;
                                <Link underline="hover" to="create" component={RouterLink}>
                                    Create
                                </Link>
                            </Typography>
                        </ContentStyle>
                    </Container>
                </Grid>
            </Grid>
        </RootStyle >
    );
}
