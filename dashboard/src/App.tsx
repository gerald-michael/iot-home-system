import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { useContext, useEffect } from 'react';
import Profile from './pages/profile/Profile';
import Users from './pages/users/Users';
import SmsList from './pages/sms/List';
import SmsTest from './pages/sms/Test';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Login from './pages/auth/login/Login';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';
import { AuthContext } from './store/context/auth';
import {
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import RegisterForm from './pages/users/RegisterForm';
import UserEdit from './pages/users/UserEdit';
import SmsHistory from './pages/sms/SmsHistory';
import UserHistory from './pages/users/UserHistory';
// ----------------------------------------------------------------------

export default function App() {
  const { auth, authCheckState, clear } = useContext(AuthContext)
  useEffect(() => {
    if (!auth.token) {
      authCheckState()
      clear()
    }
  }, [])
  return (
    <>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Routes>
          {auth.token ? (
            <>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="profile/" element={<Profile />} />
              <Route path="/404" element={<NotFound />} />
              {auth.password_change_required ?
                <>
                  <Route path="*" element={<Navigate to="/profile" replace />} />
                </>
                :
                <>
                  <Route path="dashboard/" element={<DashboardLayout />}>
                    <Route index element={<DashboardApp />} />
                    <Route path="profile/" element={<Profile />} />
                    <Route path="users">
                      <Route path="all/" element={<Users />} />
                      <Route path="register/" element={<RegisterForm />} />
                      <Route path=":userid/">
                        <Route path="edit/" element={<UserEdit />} />
                        <Route path="history/" element={<UserHistory />} />
                      </Route>
                    </Route>
                    <Route path="sms">
                      <Route path="report/" element={<SmsList />} />
                      <Route path="test/" element={<SmsTest />} />
                      <Route path="report/:smsid/" element={<SmsHistory />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Route>
                </>
              }
            </>
          ) : (
            <Route path="/" element={<LogoOnlyLayout />}>
              <Route index element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>
      </ThemeConfig>
    </>
  );
}