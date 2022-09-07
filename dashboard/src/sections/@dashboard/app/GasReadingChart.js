import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { useParams } from 'react-router-dom';
import { BaseOptionChart } from '../../../components/charts';
import { HOST_URL } from '../../../config/settings';
import useSWR from 'swr'
import Palette from '../../../theme/palette'
const token = localStorage.getItem('token')?.toString()
const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    'Authorization': 'Token ' + token
  }
}
const fetcher = (url) => fetch(url, config).then(res => res.json())
export default function SmsDeliveryChart() {
  let { householdslug } = useParams();
  const { data } = useSWR(`${HOST_URL}household/${householdslug}/device/?resourcetype=GasSensorReading`, fetcher)

  let results = {
    labels: [],
    data: [
      { name: "Gas Reading", type: "bar", data: [], fill: [], color: Palette.error.dark },
    ]
  }
  if (data && data.results) {
    for (const item of data.results) {
      results.labels.push(new Date(Date.parse(item.date_created)).toLocaleString())
      results.data[0].data.push(item.value)
    }
  }
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid'] },
    labels: results.labels,
    xaxis: { type: 'string' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Gas Reading Line Chart" subheader="" />
      {data && (
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <ReactApexChart series={results.data} options={chartOptions} height={364} />
        </Box>
      )}
    </Card>
  );
}
