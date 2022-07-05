import PropTypes from 'prop-types';
import { Box, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

SvgIconStyle.propTypes = {
  src: PropTypes.string.isRequired,
  color: PropTypes.string,
  sx: PropTypes.object
};

type Props = {
  sx: SxProps,
  color: string,
  src: string
}

export default function SvgIconStyle({ src, color = 'inherit', sx }: Props) {
  return (
    <Box
      component="span"
      sx={{
        width: 24,
        height: 24,
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        bgcolor: `${color}.main`,
        ...(color === 'inherit' && { bgcolor: 'currentColor' }),
        ...(color === 'action' && { bgcolor: 'action.active' }),
        ...(color === 'disabled' && { bgcolor: 'action.disabled' }),
        ...(color === 'paper' && { bgcolor: 'background.paper' }),
        ...sx
      }}
    />
  );
}
