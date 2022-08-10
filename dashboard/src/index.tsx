import 'simplebar/src/simplebar.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from "notistack"
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import AuthContextProvider from './store/context/auth'
import { PermissionProvider } from './store/context/permissions';
import HouseholdContextProvider from './store/context/household';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthContextProvider>
    <PermissionProvider>
      <HouseholdContextProvider>
        <HelmetProvider>
          <BrowserRouter>
            <SnackbarProvider maxSnack={5}>
              <App />
            </SnackbarProvider>
          </BrowserRouter>
        </HelmetProvider>
      </HouseholdContextProvider>
    </PermissionProvider>
  </AuthContextProvider>
);
serviceWorker.unregister();
reportWebVitals();