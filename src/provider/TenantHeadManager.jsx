import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTenant } from "./TenantProvider.jsx";

export const TenantHeadManager = () => {
    const { tenantConfig, loading } = useTenant();

    useEffect(() => {
        // Only run when we have a valid favicon URL
        if (!loading && tenantConfig?.faviconUrl) {

            // 1. Find existing favicon tags
            const existingLinks = document.querySelectorAll("link[rel*='icon']");

            // 2. If they exist, update them; otherwise, create a new one
            if (existingLinks.length > 0) {
                existingLinks.forEach(link => {
                    link.href = tenantConfig.faviconUrl;
                });
            } else {
                const link = document.createElement('link');
                link.rel = 'icon';
                link.type = 'image/x-icon';
                link.href = tenantConfig.faviconUrl;
                document.getElementsByTagName('head')[0].appendChild(link);
            }

            // 3. Optional: Force a "shortcut icon" for older browser support
            let shortcutLink = document.querySelector("link[rel='shortcut icon']");
            if (!shortcutLink) {
                shortcutLink = document.createElement('link');
                shortcutLink.rel = 'shortcut icon';
                document.getElementsByTagName('head')[0].appendChild(shortcutLink);
            }
            shortcutLink.href = tenantConfig.faviconUrl;
        }
    }, [tenantConfig?.faviconUrl, loading]);

    if (loading || !tenantConfig) return null;

    return (
        <Helmet>
            {/* Title works fine in Helmet because browsers listen for document.title changes */}
            <title>{tenantConfig.pageTitle}</title>
            <meta name="apple-mobile-web-app-title" content={tenantConfig.tenantName} />

            {/* Keep this for SSR (Search Engines), but the useEffect handles the Browser UI */}
            <link rel="icon" type="image/x-icon" href={tenantConfig.faviconUrl} />
        </Helmet>
    );
};
