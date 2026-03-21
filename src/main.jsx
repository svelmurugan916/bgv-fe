import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import {FormProvider} from "./provider/FormProvider.jsx";
import {AuthApiProvider} from "./provider/AuthApiProvider.jsx";
import {NotificationProvider} from "./context/NotificationContext.jsx"; // Import BrowserRouter


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthApiProvider>
          <FormProvider>
              <BrowserRouter>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
              </BrowserRouter>
          </FormProvider>
      </AuthApiProvider>
  </StrictMode>,
)
