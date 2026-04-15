import React, {createContext, useState, useEffect, useContext, useCallback, useRef} from 'react';
import { useAxios, RequestConfig } from '../hooks/use-axios';
import {useTenant} from './TenantProvider';
import {useAuthApi} from "./AuthApiProvider.jsx";
import {GET_TENANT_BALANCE} from "../constant/Endpoint.tsx";
import {METHOD} from "../constant/ApplicationConstant.js";

const BalanceContext = createContext(null);

export const BalanceProvider = ({ children }) => {
    const [wallet, setWallet] = useState(0);
    const [loading, setLoading] = useState(false);
    const { tenantConfig } = useTenant();
    const [latestTransaction, setLatestTransaction] = useState([]);
    const { isAuthenticated, authenticatedRequest } = useAuthApi();
    const isCandidatePath = window.location.pathname.includes('/fill-candidate-form') || window.location.pathname.includes('/address-verification-form') || window.location.pathname.includes('/digilocker-verification') || window.location.pathname.includes('/login') ;

    const fetchBalance = useCallback(async () => {
        if (!isAuthenticated || !tenantConfig?.tenantCode || isCandidatePath) return;
        try {
            setLoading(true);
            const response = await authenticatedRequest(undefined, GET_TENANT_BALANCE, METHOD.GET);
            if (response.status === 200) {
                const responseData = response.data;
                setWallet(responseData?.data);
                setLatestTransaction(responseData?.data?.recentTransactions);
            }
        } catch (error) {
            console.error("Failed to fetch balance", error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, tenantConfig?.tenantCode, authenticatedRequest]);

    // Fetch on initial load or when auth state changes
    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return (
        <BalanceContext.Provider value={{ wallet, loading, refreshBalance: fetchBalance, latestTransaction }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalanceProvider = () => {
    const context = useContext(BalanceContext);
    if (!context) throw new Error("useBalance must be used within BalanceContextProvider");
    return context;
};
