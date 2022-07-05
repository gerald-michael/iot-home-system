// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';
import useSWR from 'swr'
import { HOST_URL } from '../../../config/settings';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.primary.light
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
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

export default function AppOrganisationUserCount() {
  const { data } = useSWR(`${HOST_URL}accounts/count/`, fetcher)
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="eva:people-fill" width={24} height={24} />
      </IconWrapperStyle>
      {data ? (<Typography variant="h3">{fShortenNumber(data)}</Typography>) : <Typography variant='h3'>0</Typography>}
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total Users
      </Typography>
    </RootStyle>
  );
}
