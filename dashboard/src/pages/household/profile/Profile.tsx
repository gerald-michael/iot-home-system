import {
  Card,
  Stack,
  Container,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
// components
import * as yup from 'yup';
import Page from '../../../components/Page';
import 'yup-phone'
import { HOST_URL } from '../../../config/settings';
import EditIcon from '@mui/icons-material/Edit';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import * as Yup from 'yup';
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
const fetcher = (url: string) => fetch(url).then(res => res.json())
export default function Profile() {
  const [images, setImages] = useState<ImageListType>([]);

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages(imageList);
  };
  const { enqueueSnackbar } = useSnackbar();
  const OrganisationSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    email: Yup.string().email().required("Email is required"),
    lat: Yup.number().required("Latitude is required"),
  });

  let { orgslug } = useParams();
  const { data } = useSWR(`${HOST_URL}organisation/${orgslug}/profile/`, fetcher)
  const formik = useFormik({
    initialValues: {
      description: "",
      lat: '',
      long: '',
      address: '',
      phonenumber: '',
      email: ""
    },
    validationSchema: OrganisationSchema,
    onSubmit: (values) => {
      // navigate('/dashboard', { replace: true });
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      enqueueSnackbar("Can't get location", {
        variant: 'error',
      })
    }
  }
  function showPosition(position: GeolocationPosition) {
    setFieldValue('lat', position.coords.latitude)
    setFieldValue('long', position.coords.longitude)
  }
  return (
    <Page title="Profile | HSSIOT">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Organisation Profile
          </Typography>
        </Stack>

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
                            {data && data[0].logo ? (
                              <Avatar src={data[0].logo} alt="photoURL" sx={{ height: 150, width: 150, }} />
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    autoComplete="phonenumber"
                    type="text"
                    label="Phone Number"
                    {...getFieldProps('phonenumber')}
                    error={Boolean(touched.phonenumber && errors.phonenumber)}
                    helperText={touched.phonenumber && errors.phonenumber}
                  />
                  <TextField
                    fullWidth
                    autoComplete="email"
                    type="text"
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>
                <TextField
                  fullWidth
                  autoComplete="description"
                  type="text"
                  multiline
                  minRows={4}
                  label="Description"
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
                <TextField
                  fullWidth
                  autoComplete="address"
                  type="text"
                  label="Address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

                  <TextField
                    fullWidth
                    autoComplete="lat"
                    type="text"
                    label="Latitude"
                    {...getFieldProps('lat')}
                    error={Boolean(touched.lat && errors.lat)}
                    helperText={touched.lat && errors.lat}
                  />
                  <TextField
                    fullWidth
                    autoComplete="long"
                    type="text"
                    label="Logitude"
                    {...getFieldProps('long')}
                    error={Boolean(touched.long && errors.long)}
                    helperText={touched.long && errors.long}
                  />
                  <IconButton onClick={getLocation}>
                    <AddLocationIcon />
                  </IconButton>
                </Stack>
              </Stack>

              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                endIcon={<SaveIcon />}
                sx={{ marginLeft: '40%' }}
              // loading={auth.loading}
              >
                Save
              </LoadingButton>
            </Form>
          </FormikProvider>
        </Card>
      </Container>
    </Page>
  );
}
