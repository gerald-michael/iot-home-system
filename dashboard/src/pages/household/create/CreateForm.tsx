import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Stack,
  TextField,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
// component
import SaveAsIcon from '@mui/icons-material/SaveAs';
// ---------------------------------------------------
import { HouseholdContext } from "../../../store/context/household"
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddLocationIcon from '@mui/icons-material/AddLocation';

export default function CreateForm() {
  const HouseholdSchema = Yup.object().shape({
    household_name: Yup.string().required('Household name is required'),
    active: Yup.boolean().required('Active is required'),
    lat: Yup.number().required("Latitude is required"),
    long: Yup.number().required("Longitude is required"),
    address: Yup.string().required("Address is required"),
    description: Yup.string().required("Description is required"),
    email: Yup.string().email().required("Email is required"),
    phonenumber: Yup.string().phone().required("Phone Number is required")
  });
  const { household, createHousehold, clear } = useContext(HouseholdContext)
  const formik = useFormik({
    initialValues: {
      household_name: '',
      active: false,
      phonenumber: "",
      lat: "",
      long: "",
      address: "",
      description: "",
      email: "",
    },
    validationSchema: HouseholdSchema,
    onSubmit: (values) => {
      createHousehold(values.household_name, values.email, values.phonenumber, values.address, values.lat, values.long, values.description, values.active)
    }
  });
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  useEffect(() => {
    if (household.success) {
      enqueueSnackbar(household.success, {
        variant: 'success',
      })
      navigate("/household/")
      clear()
    } else if (household.error) {
      enqueueSnackbar(household.error, {
        variant: 'error',
      })
    }
  }, [household])
  function showPosition(position: GeolocationPosition) {
    setFieldValue('lat', position.coords.latitude)
    setFieldValue('long', position.coords.longitude)
  }
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      enqueueSnackbar("Can't get location", {
        variant: 'error',
      })
    }
  }
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ marginBottom: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type="text"
              label="Household Name"
              {...getFieldProps('household_name')}
              error={Boolean(touched.household_name && errors.household_name)}
              helperText={touched.household_name && errors.household_name}
            />
            <TextField
              fullWidth
              type="text"
              label="Household Address"
              {...getFieldProps('address')}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
            />
          </Stack>
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type="email"
              label="Household Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
            <TextField
              fullWidth
              type="text"
              label="Household Phone Number"
              {...getFieldProps('phonenumber')}
              error={Boolean(touched.phonenumber && errors.phonenumber)}
              helperText={touched.phonenumber && errors.phonenumber}
            />
          </Stack>
          <TextField
            fullWidth
            type="text"
            label="Household Description"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />

          <FormControlLabel
            control={<Checkbox checked={formik.values.active} />}
            label="Active"
            name="active"
            id="active"
            onChange={formik.handleChange}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={household.loading}
          endIcon={<SaveAsIcon />}
        >
          Create Household
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
