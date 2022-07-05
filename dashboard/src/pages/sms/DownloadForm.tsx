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
    IconButton,
    MenuItem
} from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useFormik, Form, FormikProvider } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Iconify from '../../components/Iconify';
import axios from 'axios';
import { HOST_URL } from '../../config/settings';
import moment from 'moment';

interface Props {
    close: any,
}
const statuses = [
    {
        id: 'FAILED',
        label: "FAILED"
    },
    {
        id: "DELIVERED",
        label: "DELIVERED"
    },
    {
        id: "PENDING",
        label: "PENDING"
    },
]
export default function DownloadForm(props: Props) {
    const { close } = props
    const { enqueueSnackbar } = useSnackbar();
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false)
    const SmsDownloadSchema = Yup.object().shape({
        start: Yup.date(),
        end: Yup.date(),
        delivery_status: Yup.string(),
    });
    const downloadSms = (delivery_status: string, start: Date | null, end: Date | null) => {
        const token = localStorage.getItem('token')?.toString()
        if (token) {
            const config = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Token ' + token
                }
            }
            let query = ""
            if (delivery_status) {
                query += `delivery_status=${delivery_status}&`
            }
            if (start) {
                query += `created_date_start=${moment(start.toLocaleDateString()).format('YYYY-MM-DD')}&`
            }
            if (end) {
                query += `created_date_end=${moment(end.toLocaleDateString()).format('YYYY-MM-DD')}&`
            }
            axios.get(`${HOST_URL}sms/download/?${query}`, config).then(res => {
                enqueueSnackbar("Sms Report downloaded successfully", {
                    variant: 'success',
                })
            }).catch(err => {
                enqueueSnackbar("Failed to Download", {
                    variant: 'error',
                })
            })
        } else {
            enqueueSnackbar("You have to be logged in", {
                variant: 'error',
            })
        }
    }
    const formik = useFormik({
        initialValues: {
            start: null,
            end: null,
            delivery_status: ""
        },
        validationSchema: SmsDownloadSchema,
        onSubmit: (values) => {
            console.log(values)
            downloadSms(values.delivery_status, values.start, values.end)
        }
    });

    const { errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
    return (
        <DialogContent>
            <Page title="Download Sms | SPREAD">
                <Paper sx={{ maxWidth: '60vw', padding: 2, marginX: "auto", maxHeight: "95vh", overflow: "auto" }}>
                    <Typography variant='h5' sx={{ marginBottom: 2 }}>Download Sms Report</Typography>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="delivery_status"
                                id="delivery_status"
                                select
                                label="Delivery Status"
                                value={formik.values.delivery_status}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.delivery_status &&
                                    Boolean(formik.errors.delivery_status)
                                }
                                helperText={
                                    formik.touched.delivery_status && formik.errors.delivery_status
                                }
                            >
                                {statuses.map((status) => {
                                    return (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.label}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                            <Stack spacing={3} sx={{ marginY: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <DatePicker
                                            label="Start Date"
                                            value={start}
                                            onChange={(newValue) => {
                                                setStart(newValue);
                                                setFieldValue('start', newValue)
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params}
                                                {...getFieldProps('start')}
                                                error={Boolean(touched.start && errors.start)}
                                            />}
                                        />
                                        <DatePicker
                                            label="End Date"
                                            value={end}
                                            onChange={(newValue) => {
                                                setEnd(newValue);
                                                setFieldValue('end', newValue)
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params}
                                                {...getFieldProps('end')}
                                                error={Boolean(touched.end && errors.end)}
                                            />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
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
                                >
                                    Download
                                </LoadingButton>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </Paper>
            </Page>
        </DialogContent>
    )
}