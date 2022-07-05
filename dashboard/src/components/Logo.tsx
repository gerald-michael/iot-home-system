import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

interface Props {
  sx?: SxProps
}

export default function Logo(props: Props) {
  const { sx } = props
  return (
    <RouterLink to="/">
      <Box component="img" src="static/logo.jpg" sx={{height: 75, ...sx }} />
    </RouterLink>
  );
}
