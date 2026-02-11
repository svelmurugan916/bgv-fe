import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { RequestConfig, useAxios } from "../hooks/use-axios.js";
import { AUTH_TYPE, METHOD } from "../constant/ApplicationConstant.js";
import { jwtDecode } from "jwt-decode";
import { LOGOUT, REFRESH_TOKEN, USER_PROFILE, VERIFY_CREDENTIALS } from "../constant/Endpoint.tsx";

const AuthApiContext = createContext(undefined);

export const AuthApiProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [tokenType, setTokenType] = useState(null);
    const [loggedInRole, setLoggedInRole] = useState(null);
    const [userType, setUserType] = useState(null);
    const { apiCallHit } = useAxios();
    const gettingToken = useRef(false);
    const initialized = useRef(false);
    const isAuthenticated = !!accessToken;

    // Helper to identify if current user is a candidate on the form
    const isCandidatePath = window.location.pathname.includes('/fill-candidate-form') || window.location.pathname.includes('/address-verification-form');

    const clearAuthStates = useCallback(() => {
        setAccessToken("");
        setLoggedInRole(null);
        setUserType(null);
        setTokenType(null);
        setUser(null);
    }, []);

    const handleTokenUpdate = useCallback((token) => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setLoggedInRole(decoded?.active_role || null);
                setUserType(decoded?.user_type || null);
                setTokenType(decoded?.token_type || null);
                setAccessToken(token);
            } catch (error) {
                console.error("Token decoding failed:", error);
                clearAuthStates();
            }
        } else {
            clearAuthStates();
        }
    }, [clearAuthStates]);

    const refreshAccessToken = useCallback(async () => {
        // 1. Skip refresh if we are on the candidate form path
        if (gettingToken.current || isCandidatePath) return null;

        gettingToken.current = true;
        try {
            const config = new RequestConfig()
                .setUrl(REFRESH_TOKEN)
                .setMethod(METHOD.POST)
                .setType(AUTH_TYPE.AUTH);

            const response = await apiCallHit(config);
            const newAccessToken = response.data?.responseData?.accessToken || response.data?.accessToken;

            if (newAccessToken) {
                handleTokenUpdate(newAccessToken);
                setUser(response?.data?.user);
                return newAccessToken;
            } else {
                clearAuthStates();
                return null;
            }
        } catch (error) {
            console.error("Refresh Token API Error:", error);
            clearAuthStates();
            return null;
        } finally {
            gettingToken.current = false;
        }
    }, [apiCallHit, handleTokenUpdate, clearAuthStates, isCandidatePath]);

    const fetchUserDetails = useCallback(async (tokenOverride) => {
        try {
            const config = new RequestConfig()
                .setUrl(USER_PROFILE)
                .setMethod(METHOD.GET);

            if (tokenOverride) {
                config.setHeaders({ 'Authorization': `Bearer ${tokenOverride}` });
            }

            const response = await apiCallHit(config);

            if (response && response.status === 200) {
                const userData = response.data?.responseData?.user || response.data;
                setUser(userData);
                return userData;
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    }, [apiCallHit]);

    const authenticatedRequest = useCallback(async (request, url, method = METHOD.POST, options = {}) => {
        const startTime = Date.now();

        const config = new RequestConfig()
            .setUrl(url)
            .setMethod(method)
            .setType(AUTH_TYPE.AUTH)
            .setData(request);

        if (options.responseType) {
            config.setResponseType(options.responseType);
        }

        if (options.onUploadProgress) {
            config.setOnUploadProgress(options.onUploadProgress);
        }

        if(options.params) {
            config.setParams(options.params);
        }

        let currentToken = accessToken;

        // 2. Only attempt refresh if currentToken is missing/expired AND we aren't on candidate path
        if (!currentToken || isTokenExpired(currentToken)) {
            if (!isCandidatePath) {
                currentToken = await refreshAccessToken();
            }
        }

        if (!currentToken) throw new Error("Session Expired");

        config.setHeaders({ 'Authorization': `Bearer ${currentToken}` });
        const response =  await apiCallHit(config);

        const duration = Date.now() - startTime;
        const minimumWait = 800;
        if (duration < minimumWait) {
            await new Promise(resolve => setTimeout(resolve, minimumWait - duration));
        }
        return response;
    }, [accessToken, refreshAccessToken, apiCallHit, isCandidatePath]);

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            return (decoded.exp || 0) < (Date.now() / 1000) + 10;
        } catch { return true; }
    };

    const unAuthenticatedRequest = useCallback(async (request, url, method = METHOD.POST) => {
        const startTime = Date.now();
        const config = new RequestConfig()
            .setUrl(url)
            .setMethod(method)
            .setType(AUTH_TYPE.AUTH)
            .setData(request);
        const response = await apiCallHit(config);

        const duration = Date.now() - startTime;
        const minimumWait = 800;
        if (duration < minimumWait) {
            await new Promise(resolve => setTimeout(resolve, minimumWait - duration));
        }
        return response;
    }, [apiCallHit]);

    const login = useCallback(async (credentials, setError) => {
        setLoading(true);
        try {
            const config = new RequestConfig()
                .setUrl(VERIFY_CREDENTIALS)
                .setMethod(METHOD.POST)
                .setType(AUTH_TYPE.AUTH)
                .setData(credentials);

            const response = await apiCallHit(config);
            return response;
        } catch (error) {
            if (error.response?.status === 401) {
                return { error: true, message: "Invalid username or password", status: 401 };
            }
        } finally {
            setLoading(false);
        }
    }, [apiCallHit]);

    const logout = useCallback(async () => {
        try {
            await authenticatedRequest(undefined, LOGOUT, METHOD.POST);
        } finally {
            clearAuthStates();
        }
    }, [authenticatedRequest, clearAuthStates]);

    // INITIALIZATION LOGIC
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const init = async () => {
            // 3. If on candidate path, don't try to refresh on boot.
            // The BGVForm will handle setting the token from URL/Storage.
            if (isCandidatePath) {
                setLoading(false);
                return;
            }

            try {
                await refreshAccessToken();
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [refreshAccessToken, isCandidatePath]);

    const value = useMemo(() => ({
        accessToken, user, loading, login, logout, isAuthenticated,
        authenticatedRequest, unAuthenticatedRequest,
        setAuthData: handleTokenUpdate,
        loggedInRole, userType, tokenType, setUser, setLoading
    }), [accessToken, user, loading, login, logout, isAuthenticated, authenticatedRequest, unAuthenticatedRequest, handleTokenUpdate, loggedInRole, userType, tokenType]);

    return <AuthApiContext.Provider value={value}>{children}</AuthApiContext.Provider>;
};

export const useAuthApi = () => {
    const context = useContext(AuthApiContext);
    if (!context) throw new Error("useAuthApi must be used within AuthApiProvider");
    return context;
};
