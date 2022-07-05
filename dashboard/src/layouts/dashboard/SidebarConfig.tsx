import Iconify from '../../components/Iconify';
const getIcon = (name: string) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/',
    permission: 'can_view_sms',
    icon: getIcon('ci:dashboard')
  },
  {
    title: 'sms',
    permission: ['can_view_sms', 'can_send_test_sms'],
    icon: getIcon('fa-solid:sms'),
    children: [
      {
        title: 'report',
        permission: 'can_view_sms',
        path: 'sms/report/',
      },
      {
        title: 'Test',
        permission: 'can_send_test_sms',
        path: 'sms/test/',
      },
    ]
  },
  {
    title: 'users',
    permission: ['view_user', 'add_user'],
    icon: getIcon('fa-solid:users'),
    children: [
      {
        title: 'All User',
        permission: 'view_user',
        path: 'users/all/',
      },
      {
        title: 'register',
        permission: 'add_user',
        path: 'users/register/',
      },
    ]
  },
];

export default sidebarConfig;
