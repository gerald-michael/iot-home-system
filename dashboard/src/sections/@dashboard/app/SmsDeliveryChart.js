import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';
import { HOST_URL } from '../../../config/settings';
import useSWR from 'swr'
import Palette from '../../../theme/palette'
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
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
  const { data } = useSWR(`${HOST_URL}sms/total_sms_per_month/`, fetcher)

  let results = {
    labels: [],
    data: [
      { name: "total", type: "column", data: [], color: Palette.info.dark },
      { name: "delivered", type: "line", data: [], color: Palette.success.dark  },
      { name: "pending", type: "line", data: [], color: Palette.warning.dark  },
      { name: "failed", type: "line", data: [], fill: [], color: Palette.error.dark  },
    ]
  }
  if (data) {
    for (const item of data) {
      results.labels.push(monthNames[item.month - 1])
      results.data[0].data.push(item.total)
      results.data[1].data.push(item.delivered)
      results.data[2].data.push(item.pending)
      results.data[3].data.push(item.failed)
    }
  }
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'solid', 'solid'] },
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
      <CardHeader title="Sms Delivery" subheader="" />
      {data && (
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <ReactApexChart type="line" series={results.data} options={chartOptions} height={364} />
        </Box>
      )}
    </Card>
  );
}
