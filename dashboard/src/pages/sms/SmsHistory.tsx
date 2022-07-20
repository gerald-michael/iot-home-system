import { Can } from '../../store/context/permissions';
import Page from '../../components/Page';
import { styled } from '@mui/material/styles';
import {
    Container, Grid, Card, CardContent, Typography, Chip, Divider, Stack,
} from '@mui/material';
import useSWR from 'swr'
import { HOST_URL } from '../../config/settings';
import { useParams } from 'react-router';
const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10)
}));
const fetcher = (url: string) => fetch(url).then(res => res.json())
export default function SmsHistory() {
    const { smsid } = useParams()
    const { data } = useSWR(`${HOST_URL}sms/${smsid}/`, fetcher)
    return (
        <Can permissions={"view_historicalsmsout"}>
            <RootStyle title="Test Sms | IOT S&S">
                <Container>
                    <Grid container spacing={2}>
                        {data && (
                            <>
                                {data.history.map((history_item: any) => {
                                    return (
                                        <Grid item xs={12} md={6}>
                                            <Card>
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
                                                    {history_item.phone_number && (
                                                        <Typography>
                                                            Phone Number: {history_item.phone_number}
                                                        </Typography>
                                                    )}
                                                    {history_item.message_id && (
                                                        <Typography>
                                                            Message Id: {history_item.message_id}
                                                        </Typography>
                                                    )}
                                                    {history_item.delivery_status && (
                                                        <Typography>
                                                            Delivery Status: <Chip label={history_item.delivery_status} color={history_item.delivery_status === 'DELIVERED' ? 'success' : history_item.delivery_status === 'PENDING' ? 'warning' : "error"} />
                                                        </Typography>
                                                    )}
                                                    {history_item.account_no && (
                                                        <Typography>
                                                            Account Number: {history_item.account_no}
                                                        </Typography>
                                                    )}
                                                    {history_item.status && (
                                                        <Typography>
                                                            Status: {history_item.status}
                                                        </Typography>
                                                    )}
                                                    {history_item.created_date && (
                                                        <Typography>
                                                            Created Date: {history_item.created_date}
                                                        </Typography>
                                                    )}
                                                    {history_item.date && (
                                                        <Typography>
                                                            SMS Out Date: {history_item.date}
                                                        </Typography>
                                                    )}
                                                    {history_item.sms_type && (
                                                        <Typography>
                                                            SMS Type: {history_item.sms_type}
                                                        </Typography>
                                                    )}
                                                    {history_item.entity_num && (
                                                        <Typography>
                                                            Entity Num: {history_item.entity_num}
                                                        </Typography>
                                                    )}
                                                    {history_item.slno && (
                                                        <Typography>
                                                            SLNO: {history_item.slno}
                                                        </Typography>
                                                    )}
                                                    {history_item.message && (
                                                        <Typography>
                                                            Message: {history_item.message}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </>
                        )}
                    </Grid>
                </Container>
            </RootStyle>
        </Can>
    )
}
