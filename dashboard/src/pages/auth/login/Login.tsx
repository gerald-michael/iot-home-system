// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Grid } from '@mui/material';
// components
import Page from '../../../components/Page';
import LoginForm from './LoginForm';

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
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));
// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login | IOT S&S">
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
            <img src="/static/authentication.svg" alt="login" />
          </SectionStyle>
        </Grid>

        <Grid item xs={12} md={8}>

          <Container maxWidth="sm">
            <ContentStyle>
              <Stack sx={{ mb: 5 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
              </Stack>
              <LoginForm />
            </ContentStyle>
          </Container>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
