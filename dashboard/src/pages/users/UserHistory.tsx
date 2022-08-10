import { Can } from '../../store/context/permissions';
import Page from '../../components/Page';
import { styled } from '@mui/material/styles';
import {
    Container, Grid, Card, CardContent, Typography, Chip, Divider, Stack, Avatar, Box,
} from '@mui/material';
import useSWR from 'swr'
import { BASE_URL, HOST_URL } from '../../config/settings';
import { useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10)
}));
const fetcher = (url: string) => fetch(url).then(res => res.json())
export default function UserHistory() {
    const { userid } = useParams()
    const { data } = useSWR(`${HOST_URL}accounts/${userid}/`, fetcher)
    return (
        <Can permissions={"view_historicaluser"}>
            <RootStyle title="Test Sms | HSSIOT">
                <Container>
                    <Grid container spacing={2}>
                        {data && (
                            <>
                                <Grid item xs={6}>
                                    <Stack
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={{ xs: 1, sm: 2, md: 4 }}
                                    >
                                        <Card sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant='h5' sx={{ marginBottom: 1 }} >
                                                    User
                                                </Typography>
                                                <Divider sx={{ marginBottom: 2 }} />
                                            </CardContent>
                                        </Card>
                                        {data.history.map((history_item: any) => {
                                            return (
                                                <Card sx={{ width: "100%" }} key={history_item.history_date}>
                                                    <CardContent>
                                                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                                                            <Typography variant='h5' sx={{ marginBottom: 1 }} >
                                                                {history_item.history_change_reason}
                                                            </Typography>
                                                            <Chip
                                                                label={history_item.history_type === '+' ? 'Create' : history_item.history_type === '~' ? 'Update' : "Delete"}
                                                                color={history_item.history_type === '+' ? 'success' : history_item.history_type === '~' ? 'warning' : "error"}
                                                            />
                                                        </Stack>
                                                        {history_item.history_date && (
                                                            <Typography variant='body2'>
                                                                Time: {new Date(Date.parse(history_item.history_date)).toLocaleString()}
                                                            </Typography>
                                                        )}
                                                        <Divider sx={{ marginBottom: 2 }} />
                                                        {history_item.username && (
                                                            <Typography>
                                                                Username: {history_item.username}
                                                            </Typography>
                                                        )}
                                                        {history_item.email && (
                                                            <Typography>
                                                                Email: {history_item.email}
                                                            </Typography>
                                                        )}
                                                        {history_item.last_login && (
                                                            <Typography variant='body2'>
                                                                Last Login: {new Date(Date.parse(history_item.last_login)).toLocaleString()}
                                                            </Typography>
                                                        )}
                                                        {history_item.date_joined && (
                                                            <Typography variant='body2'>
                                                                Date Joined: {new Date(Date.parse(history_item.date_joined)).toLocaleString()}
                                                            </Typography>
                                                        )}
                                                        <Typography>
                                                            Is Staff: {history_item.is_staff ? (<><CheckIcon color='success' /></>) : (<><CloseIcon color="error" /></>)}
                                                        </Typography>
                                                        <Typography>
                                                            Is Active: {history_item.is_active ? (<><CheckIcon color='success' /></>) : (<><CloseIcon color="error" /></>)}
                                                        </Typography>
                                                        <Typography>
                                                            is_verified: {history_item.is_verified ? (<><CheckIcon color='success' /></>) : (<><CloseIcon color="error" /></>)}
                                                        </Typography>
                                                        <Typography>
                                                            is_superuser: {history_item.is_superuser ? (<><CheckIcon color='success' /></>) : (<><CloseIcon color="error" /></>)}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </Stack>
                                </Grid>
                                <Grid item xs={6}>
                                    <Stack
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={{ xs: 1, sm: 2, md: 4 }}
                                    >
                                        <Card sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant='h5' sx={{ marginBottom: 1 }} >
                                                    User Profile
                                                </Typography>
                                                <Divider sx={{ marginBottom: 2 }} />
                                            </CardContent>
                                        </Card>
                                        {data.user_profile.history.map((history_item: any) => {
                                            return (
                                                <Card sx={{ width: "100%" }} key={history_item.history_date}>
                                                    <CardContent>
                                                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                                                            <Typography variant='h5' sx={{ marginBottom: 1 }} >
                                                                {history_item.history_change_reason}
                                                            </Typography>
                                                            <Chip
                                                                label={history_item.history_type === '+' ? 'Create' : history_item.history_type === '~' ? 'Update' : "Delete"}
                                                                color={history_item.history_type === '+' ? 'success' : history_item.history_type === '~' ? 'warning' : "error"}
                                                            />
                                                        </Stack>
                                                        {history_item.history_date && (
                                                            <Typography variant='body2'>
                                                                Time: {new Date(Date.parse(history_item.history_date)).toLocaleString()}
                                                            </Typography>
                                                        )}
                                                        <Divider sx={{ marginBottom: 2 }} />
                                                        <Box sx={{ marginLeft: "40%" }}>
                                                            {history_item.image && (
                                                                <Avatar src={history_item.image.includes(BASE_URL) ? `${history_item.image}` : `${BASE_URL}${history_item.image}`} alt="user profile image" />
                                                            )}
                                                        </Box>
                                                        {history_item.phone_number && (
                                                            <Typography>
                                                                Phone Number: {history_item.phone_number}
                                                            </Typography>
                                                        )}
                                                        {history_item.firstname && (
                                                            <Typography>
                                                                First Name: {history_item.firstname}
                                                            </Typography>
                                                        )}
                                                        {history_item.lastname && (
                                                            <Typography>
                                                                Last Name: {history_item.lastname}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </Stack>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Container>
            </RootStyle>
        </Can >
    )
}
