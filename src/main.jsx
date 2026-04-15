import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import {FormProvider} from "./provider/FormProvider.jsx";
import {AuthApiProvider} from "./provider/AuthApiProvider.jsx";
import {NotificationProvider} from "./context/NotificationContext.jsx";
import {HelmetProvider} from "react-helmet-async";
import {TenantHeadManager} from "./provider/TenantHeadManager.jsx";
import {TenantProvider} from "./provider/TenantProvider.jsx";
import {BalanceProvider} from "./provider/BalanceProvider.jsx"; // Import BrowserRouter


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <TenantProvider>
                <AuthApiProvider>
                    <BalanceProvider>
                        <FormProvider>
                            <BrowserRouter>
                                <NotificationProvider>
                                    <TenantHeadManager /> {/* Applies the branding */}
                                    <App />
                                </NotificationProvider>
                            </BrowserRouter>
                        </FormProvider>
                    </BalanceProvider>
                </AuthApiProvider>
            </TenantProvider>
        </HelmetProvider>
    </StrictMode>
    ,
)
