import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography, Grid } from '@mui/material';
// components
import Page from '../../../components/Page';
import CreateForm from './CreateForm';
import Logo from '../../../components/Logo';

// ----------------------------------------------------------------------

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
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Create() {
  return (
    <RootStyle title="Create Household | HSSIOT">
      <Logo sx={{
        position: 'absolute',
        left: 22,
        top: 30,
        zIndex:1
      }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
            <img src="/static/home_settings.svg" alt="household create" />
          </SectionStyle>
        </Grid>

        <Grid item xs={12} md={6}>

          <Container maxWidth="sm">
            <ContentStyle>
              <Stack sx={{ mb: 5 }}>
                <Typography variant="h4" gutterBottom>
                  Create Household
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your household details below.</Typography>
              </Stack>
              <CreateForm />
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 3,
                  textAlign: 'center',
                }}
              >
                Your households?&nbsp;
                <Link underline="hover" to="../" component={RouterLink}>
                  Households
                </Link>
              </Typography>
            </ContentStyle>
          </Container>
        </Grid>
      </Grid>
    </RootStyle>
  );
}