import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

interface Props {
  children: JSX.Element | JSX.Element[],
  title: string,
  other?: any,
}
const Page = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Box ref={ref} {...props.other}>
    <Helmet>
      <title>{props.title}</title>
    </Helmet>
    {props.children}
  </Box>
));

export default Page;
