// material
import { styled } from '@mui/material/styles';
import {
  Stack,
  Typography,
  TextField,
  Container
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Page from '../../components/Page';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
// component
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import 'yup-phone'
import axios from 'axios';
import { HOST_URL } from '../../config/settings';
import { Can } from '../../store/context/permissions';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
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

export default function TestSms() {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const TestSmsSchema = Yup.object().shape({
    message: Yup.string().required('Message is required'),
    phone_number: Yup.string().phone('UG', true, `Phone number should have prefix 256`).required('Phone Number is required')
  });
  const formik = useFormik({
    initialValues: {
      message: '',
      phone_number: '',
    },
    validationSchema: TestSmsSchema,
    onSubmit: (values, { resetForm }) => {
      setLoading(true)
      axios.defaults.withCredentials = false
      axios.post(`${HOST_URL}sms/test/`, {
        'message': values.message,
        'phone_number': values.phone_number
      }, config).then((res) => {
        enqueueSnackbar(`Message sent successfully, message ID: ${res.data}`, {
          variant: 'success',
        })
        resetForm()
      }).catch((err) => {
        enqueueSnackbar("Failed to send message", {
          variant: 'error',
        })
      })
      setLoading(false)
    }
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <Can permissions={"can_send_test_sms"}>
      <RootStyle title="Test Sms | HFB">
        <Container sx={{ maxWidth: '70vw' }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ marginBottom: 2 }}>
                <Typography variant='h5'>
                  Send Message
                </Typography>
                <TextField
                  fullWidth
                  autoComplete="message"
                  type="text"
                  label="Message"
                  {...getFieldProps('message')}
                  error={Boolean(touched.message && errors.message)}
                  helperText={touched.message && errors.message}
                />
                <TextField
                  fullWidth
                  autoComplete="phone_number"
                  type="text"
                  label="Phone Number"
                  {...getFieldProps('phone_number')}
                  error={Boolean(touched.phone_number && errors.phone_number)}
                  helperText={touched.phone_number && errors.phone_number}
                />
                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  endIcon={
                    <SendIcon />
                  }
                  sx={{
                    marginRight: 0
                  }}
                  loading={loading}
                >
                  Send
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>
        </Container>
      </RootStyle>
    </Can>
  );
}
