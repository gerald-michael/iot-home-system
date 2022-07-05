import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Card, Stack, CardContent, CardHeader, Typography } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { styled } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;
interface UserMoreProps {
  user_id: number
}
export default function UserMoreMenu(props: UserMoreProps) {
  const { user_id } = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpen}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`/dashboard/users/${user_id}/edit/`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem component={RouterLink} to={`/dashboard/users/${user_id}/history/`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="bi:clock-history" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="History" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
      <StyledModal
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Card>
          <CardContent>
            <Typography variant="h5">
              Are You sure you want to delete?
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: 2 }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              // loading={auth.loading}
              >
                Delete
              </LoadingButton>
            </Stack>
          </CardContent>
        </Card>
      </StyledModal>
    </>
  );
}
