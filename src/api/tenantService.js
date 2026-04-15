import axios from 'axios';
import {RequestConfig, useAxios} from "../hooks/use-axios.js";
import {AUTH_TYPE, METHOD} from "../constant/ApplicationConstant.js";
import {GET_TENANT_METADATA} from "../constant/Endpoint.tsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Your backend URL


export const getTenantBranding = async (subdomain, baseDomain) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { apiCallHit } = useAxios();
    try {
        const config = new RequestConfig()
            .setUrl(`${GET_TENANT_METADATA}?subdomain=${subdomain}&baseDomain=${baseDomain}`)
            .setMethod(METHOD.GET)
            .setType(AUTH_TYPE.AUTH)
            .setData(undefined);
        // This MUST be a public endpoint on your backend
        const response = await apiCallHit(config);
        return response.data;
        /*
           Expected JSON response:
           {
             "tenantName": "Acme Corp",
             "pageTitle": "Acme | Portal",
             "faviconUrl": "https://cdn.yourdomain.com/path/to/favicon.ico",
             "logoUrl": "..."
           }
        */
    } catch (error) {
        console.error("Error fetching tenant branding:", error);
        throw error;
    }
};
