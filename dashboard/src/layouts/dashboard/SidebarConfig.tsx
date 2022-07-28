import Iconify from '../../components/Iconify';
const getIcon = (name: string) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/',
    // permission: 'can_view_sms',
    icon: getIcon('ci:dashboard')
  },
  {
    title: 'sensors',
    // permission: ['can_view_sms', 'can_send_test_sms'],
    icon: getIcon('eos-icons:iot'),
    children: [
      {
        title: 'gas sensor',
        // permission: 'can_view_sms',
        path: 'device/gas/',
      },
      {
        title: 'proximity sensor',
        // permission: 'can_send_test_sms',
        path: 'device/proximity/',
      },
      {
        title: 'touch sensor',
        // permission: 'can_view_sms',
        path: 'device/touch/',
      },
      {
        title: 'digital camera',
        // permission: 'can_send_test_sms',
        path: 'device/test/',
      },
    ]
  },
  {
    title: 'statistics',
    path: '/statistics',
    // permission: 'can_view_sms',
    icon: getIcon('icomoon-free:stats-dots')
  },
  {
    title: 'users',
    // permission: ['view_user', 'add_user'],
    icon: getIcon('fa-solid:users'),
    children: [
      {
        title: 'All User',
        // permission: 'view_user',
        path: 'users/all/',
      },
      {
        title: 'register',
        // permission: 'add_user',
        path: 'users/register/',
      },
    ]
  },
];

export default sidebarConfig;
