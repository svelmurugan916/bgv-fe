import axios from 'axios';
import { AUTH_TYPE, METHOD } from "../constant/ApplicationConstant.js";

export class RequestConfig {
    constructor() {
        this.url = '';
        this.type = AUTH_TYPE.AUTH;
        this.method = METHOD.GET;
        this.data = {};
        this.headers = {};
        this.timeout = 20000;
        this.params = {};
        this.responseType = 'json';
    }

    setUrl(url) { this.url = url; return this; }
    setType(type) { this.type = type; return this; }
    setMethod(method) { this.method = method; return this; }
    setData(data) { this.data = data; return this; }
    setParams(params) { this.params = params; return this; }
    setHeaders(headers) { this.headers = { ...this.headers, ...headers }; return this; }
    setResponseType(type) { this.responseType = type; return this; }
}

export const useAxios = () => {
    const apiCallHit = (requestConfig) => {
        const metaData = {
            // Recommendation: Use an environment variable or constant for the Base URL
            url: '/api/v1' + requestConfig.url,
            method: requestConfig.method,
            data: requestConfig.data,
            type: requestConfig.type,
            params: requestConfig.params,
            headers: requestConfig.headers,
            credentials: 'same-origin',
            responseType: requestConfig.responseType,
            // This is the key for your cookies/refresh tokens
            withCredentials: requestConfig.type === AUTH_TYPE.AUTH,
        };
        return axios(metaData);
    };
    return { apiCallHit };
};
