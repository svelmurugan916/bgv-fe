import React, {createContext, useState, useEffect, useContext, useRef} from 'react';
import { getTenantBranding } from '../api/tenantService';
import SimpleLoader from "../component/common/SimpleLoader.jsx";
import MyBrandedSpinner from "../component/common/MyBrandedSpinner.jsx"; // This function will be updated

const TenantContext = createContext(null);

// Default values for initial load or if config fails
const DEFAULT_TENANT_CONFIG = {
    tenantName: "Vantira",
    pageTitle: "Vantira | Dashboard",
    faviconUrl: "/favicon.ico", // Ensure this default favicon exists in your public folder
};

export const TenantProvider = ({ children }) => {
    const [tenantConfig, setTenantConfig] = useState(DEFAULT_TENANT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const componentInitRef = useRef(false);

    useEffect(() => {
        const initBranding = async () => {
            try {
                // const hostname = window.location.hostname;
                const hostname = 'www.app.traceu.in';
                let effectiveSubdomain = '';
                let baseDomain = ''; // You might use this later for other purposes

                // --- Robust Subdomain and Domain Extraction Logic ---
                if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
                    // Special handling for local development
                    effectiveSubdomain = 'dev'; // Use a specific identifier for local dev
                    baseDomain = hostname;
                } else {
                    const parts = hostname.split('.');
                    const numParts = parts.length;

                    // Determine the base domain (e.g., 'ford.com' from 'www.llm.ford.com')
                    // This logic is simplified for common TLDs (.com, .org, etc.).
                    // For complex TLDs like .co.uk, you'd need a more comprehensive library
                    // or a lookup table.
                    if (numParts >= 2) {
                        baseDomain = parts[numParts - 2] + '.' + parts[numParts - 1];
                    } else {
                        // Handles cases like 'mycorp' if not a full domain
                        baseDomain = hostname;
                    }

                    // Determine the effective subdomain (e.g., 'llm' from 'www.llm.ford.com')
                    // It's all parts before the base domain, excluding 'www'
                    const subdomainParts = parts.slice(0, numParts - 2);
                    const filteredSubdomainParts = subdomainParts.filter(part => part !== 'www');

                    if (filteredSubdomainParts.length > 0) {
                        effectiveSubdomain = filteredSubdomainParts.join('.');
                    }
                    // If filteredSubdomainParts is empty, effectiveSubdomain remains '',
                    // which correctly indicates no specific application subdomain (e.g., for www.ford.com or ford.com).
                }

                console.log(`Extracted: Effective Subdomain='${effectiveSubdomain}', Base Domain='${baseDomain}'`);

                // --- Fetch from Backend using the effectiveSubdomain ---
                // Your backend API should use this `effectiveSubdomain` to find the tenant's branding.
                const response = await getTenantBranding(effectiveSubdomain, baseDomain);
                console.log(response);
                if(response?.success) {
                    setTenantConfig(response?.data);
                    console.log("data -- ", response?.data);
                }

            } catch (err) {
                console.error("Failed to load tenant configuration:", err);
                setError(err);
                // Fallback to default branding if API fails or subdomain extraction fails
                setTenantConfig(DEFAULT_TENANT_CONFIG);
            } finally {
                setLoading(false);
            }
        };
        if(!componentInitRef.current) {
            componentInitRef.current = true;
            initBranding();
        }
    }, []); // Empty dependency array ensures this runs only once on component mount

    const contextValue = {
        tenantConfig,
        loading,
        error,
    };

    return (
        <TenantContext.Provider value={contextValue}>
            {/* You might want a better loading indicator here */}
            {loading ? (
                <MyBrandedSpinner
                    message="Initializing secure environment..."
                    subtext="Applying enterprise security policies and workspace configurations."
                    brandLabel="Environment Loader"
                />
            ) : (
                children
            )}
            {error && <div style={{ color: 'red', textAlign: 'center' }}>Error loading tenant branding. Using defaults.</div>}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};
