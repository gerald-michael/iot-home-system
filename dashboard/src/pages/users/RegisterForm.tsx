import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../components/Iconify';

import { AuthContext } from '../../store/context/auth';
import Page from '../../components/Page';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));
export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Username required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required').matches(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
    password2: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], "Passwords don't match.")
  });

  const { register, auth, clear } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      password2: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      register(values.email, values.username, values.password, values.password2)
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, resetForm } = formik;
  useEffect(() => {
    if (auth.success) {
      enqueueSnackbar(auth.success, {
        variant: 'success',
      })
      clear()
      resetForm()
    }
    else if (auth.error) {
      enqueueSnackbar(auth.error, {
        variant: 'error',
      })
      clear()
    }
  }, [auth])
  return (
    <RootStyle title="Register | HSSIOT">
      <Container sx={{ maxWidth: '70vw' }}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography variant='h5'>
                Register User
              </Typography>
              <TextField
                fullWidth
                label="Username"
                {...getFieldProps('username')}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
              <TextField
                fullWidth
                autoComplete="username"
                type="email"
                label="Email address"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
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

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              // loading={auth.loading}
              >
                Register
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </RootStyle>
  );
}
