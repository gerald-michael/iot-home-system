import {
    Card,
    Typography,
    Grid,
    CardContent,
    CardMedia,
    Container,
    Stack,
    Box
} from '@mui/material';
import Page from '../../components/Page';
import useSWR from 'swr'
import { HOST_URL } from '../../config/settings';
import { useParams } from 'react-router-dom';
import { fShortenNumber } from '../../utils/formatNumber';

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
export default function TouchSensor() {
    let { householdslug } = useParams();
    const { data } = useSWR(`${HOST_URL}household/${householdslug}/device/?resourcetype=TouchSensorReading`, fetcher)
    console.log(data)
    return (
        <Page title="Touch Sensor | HSSSIOT">
            <Container>
                <Typography variant="h4" gutterBottom>
                    Touch Sensor Reading
                </Typography>
                <Box sx={{ marginBottom: 5 }}></Box>
                <Grid container spacing={2}>
                    {data && data.results.map((item: any) => {
                        return (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={item.image}
                                        alt=""
                                    />
                                    <CardContent>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <Box sx={{ flexGrow: 1 }}></Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(Date.parse(item.date_created)).toLocaleString()}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Page>
    );
}
