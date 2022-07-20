import {
    Card,
    Stack,
    Container,
    Typography,
    Avatar,
    TextField,
    IconButton,
    Box,
    Button
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
// components
import * as yup from 'yup';
import Page from '../../components/Page';
import 'yup-phone'
import { useContext, useState } from 'react';
import { AuthContext } from '../../store/context/auth';
import { BASE_URL } from '../../config/settings';
import EditIcon from '@mui/icons-material/Edit';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { styled } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import PasswordChangeForm from './PasswordChangeForm';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Palette from '../../theme/palette'
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

export default function Profile() {
    const { auth, updateProfile } = useContext(AuthContext)
    const [images, setImages] = useState<ImageListType>([]);
    const [open, setOpen] = useState(auth.password_change_required);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList);
    };
    const ProfileSchema = yup.object().shape({
        lastname: yup.string().required('Last Name is required'),
        firstname: yup.string().required('First Name is required'),
        phone_number: yup.string().required('Phone is required')
    });
    const formik = useFormik({
        initialValues: {
            phone_number: auth.user_profile.phone_number,
            firstname: auth.user_profile.firstname,
            lastname: auth.user_profile.lastname
        },
        validationSchema: ProfileSchema,
        onSubmit: (values) => {
            console.log(values)
            updateProfile(values.firstname, values.lastname, values.phone_number, images)
        }
    });
    const { errors, touched, handleSubmit, getFieldProps } = formik;
    return (
        <Page title="Profile | IOT S&S">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Profile
                    </Typography>
                    <Button onClick={handleOpen}
                    >Change Password</Button>
                </Stack>
                {auth.password_change_required &&
                    <>
                        <Card sx={{ paddingX: 2, paddingBottom: 2, marginBottom: 2, backgroundColor: Palette.warning.light }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: 2 }}>
                                <Typography sx={{ flexGrow: 1 }}>Password Change is Required</Typography>
                                <PriorityHighIcon />
                            </Stack>
                        </Card>
                    </>
                }

                <Card sx={{ padding: 2, }}>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3} sx={{ marginBottom: 2 }}>
                                <Box sx={{ position: 'relative', height: 160, width: 160, marginLeft: "40%" }}>
                                    <ImageUploading
                                        value={images}
                                        onChange={onChange}
                                        dataURLKey="data_url"
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageUpdate,
                                        }) => (
                                            <>
                                                {imageList.length === 0 && (
                                                    <>
                                                        {auth.user_profile.image ? (
                                                            <Avatar src={auth.user_profile.image.includes(BASE_URL) ? `${auth.user_profile.image}` : `${BASE_URL}${auth.user_profile.image}`} alt="photoURL" sx={{ height: 150, width: 150, }} />
                                                        ) : (
                                                            <Avatar alt="photoURL" sx={{ height: 150, width: 150, }} />
                                                        )}
                                                        <IconButton color="warning" aria-label="upload picture" component="span" size="large" sx={{ position: 'absolute', bottom: -15, right: -5 }} onClick={onImageUpload}>
                                                            <EditIcon fontSize='large' />
                                                        </IconButton>
                                                    </>
                                                )}
                                                {imageList.map((image, index) => (
                                                    <Box key={index}>
                                                        <Avatar src={image['data_url']} alt="photoURL" sx={{ height: 150, width: 150, }} />
                                                        <IconButton color="warning" aria-label="upload picture" component="span" size="large" sx={{ position: 'absolute', bottom: -15, right: -5 }} onClick={() => onImageUpdate(index)}>
                                                            <EditIcon fontSize='large' />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </>
                                        )}
                                    </ImageUploading>
                                </Box>
                                <TextField
                                    fullWidth
                                    label="First name"
                                    {...getFieldProps('firstname')}
                                    error={Boolean(touched.firstname && errors.firstname)}
                                />
                                <TextField
                                    fullWidth
                                    label="Last name"
                                    {...getFieldProps('lastname')}
                                    error={Boolean(touched.lastname && errors.lastname)}
                                />
                                <TextField
                                    autoComplete="phone_number"
                                    type="text"
                                    label="Phone Number"
                                    {...getFieldProps('phone_number')}
                                    error={Boolean(touched.phone_number && errors.phone_number)}
                                />
                            </Stack>

                            <LoadingButton
                                size="large"
                                type="submit"
                                variant="contained"
                                endIcon={<SaveIcon />}
                                sx={{ marginLeft: '40%' }}
                                loading={auth.loading}
                            >
                                Save
                            </LoadingButton>
                        </Form>
                    </FormikProvider>
                </Card>
            </Container>
            <StyledModal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
            >
                <PasswordChangeForm close={handleClose} />
            </StyledModal>
        </Page>
    );
}
