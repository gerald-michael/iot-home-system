// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTotalSmsCount,
  AppTotalDeliveredSmsCount,
  GasReadingChart,
  AppTotalPendingSmsCount,
  AppTotalFailedSmsCount
} from '../sections/@dashboard/app';
import { Can } from '../store/context/permissions';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard | HSSIOT">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          {/* <Can permissions={"can_view_sms"}> */}
            {/* <Grid item xs={12} sm={6} md={3}>
              <AppTotalSmsCount />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppTotalDeliveredSmsCount />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppTotalPendingSmsCount />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppTotalFailedSmsCount />
            </Grid> */}

            <Grid item xs={12}>
              <GasReadingChart />
            </Grid>
          {/* </Can> */}
        </Grid>
      </Container>
    </Page>
  );
}
