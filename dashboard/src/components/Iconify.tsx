import PropTypes from 'prop-types';
// icons
import { IconifyIcon, Icon } from '@iconify/react';
// @mui
import { Box, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object
};
interface Props {
  icon: IconifyIcon | string,
  sx?: SxProps,
  width?: number,
  height?: number
}
export default function Iconify(props: Props) {
  const { icon, sx, width, height } = props
  return <Box component={Icon} icon={icon} sx={{ ...sx }} width={width} height={height} />;
}
