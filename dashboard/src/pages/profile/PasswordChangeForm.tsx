import Page from '../../components/Page';
import * as Yup from 'yup';
import 'yup-phone'
import { LoadingButton } from '@mui/lab';
import {
    Stack,
    Paper,
    TextField,
    DialogContent,
    Typography,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Iconify from '../../components/Iconify';
import { AuthContext } from '../../store/context/auth';
import { useNavigate } from 'react-router-dom';

interface Props {
    close: any,
}
export default function CreateForm(props: Props) {
    const { close } = props
    const { enqueueSnackbar } = useSnackbar();
    const { changePassword, clear, auth } = useContext(AuthContext);
    const PasswordChangeSchema = Yup.object().shape({
        old_password: Yup.string().required('Old Password is required'),
        password: Yup.string().required('Password is required').matches(
            /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        ),
        password2: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], "Passwords don't match.")
    });
    const formik = useFormik({
        initialValues: {
            old_password: '',
            password: '',
            password2: ''
        },
        validationSchema: PasswordChangeSchema,
        onSubmit: (values) => {
            changePassword(values.old_password, values.password, values.password2)
        }
    });
    const navigate = useNavigate()
    const { errors, touched, handleSubmit, getFieldProps } = formik;
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    useEffect(() => {
        if (auth.success) {
            enqueueSnackbar(auth.success, {
                variant: 'success',
            })
            clear()
            navigate('/dashboard/')
        } else if (auth.error) {
            enqueueSnackbar(auth.error, {
                variant: 'error',
            })
            clear()
        }
    }, [auth])
    return (
        <DialogContent>
            <Page title="Change Password | HSSIOT">
                <Paper sx={{ maxWidth: '60vw', padding: 2, marginX: "auto", maxHeight: "95vh", overflow: "auto" }}>
                    <Typography variant='h5' sx={{ marginBottom: 2 }}>Change Password</Typography>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3} sx={{ marginBotton: 2 }}>
                                <TextField
                                    fullWidth
                                    type={showPassword2 ? 'text' : 'password'}
                                    label="Old Password"
                                    {...getFieldProps('old_password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={() => setShowPassword2((prev) => !prev)}>
                                                    <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={Boolean(touched.old_password && errors.old_password)}
                                    helperText={touched.old_password && errors.old_password}
                                />
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    {...getFieldProps('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <TextField
                                    fullWidth
                                    type={showPassword1 ? 'text' : 'password'}
                                    label="Confirm Password"
                                    {...getFieldProps('password2')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={() => setShowPassword1((prev) => !prev)}>
                                                    <Iconify icon={showPassword1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={Boolean(touched.password2 && errors.password2)}
                                    helperText={touched.password2 && errors.password2}
                                />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: 2 }}>
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="outlined"
                                    onClick={() => { close() }}
                                >
                                    Cancel
                                </LoadingButton>
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={auth.loading}
                                >
                                    Change Password
                                </LoadingButton>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </Paper>
            </Page>
        </DialogContent>
    )
}