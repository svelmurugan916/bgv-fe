import React, {useState, useEffect, useRef} from 'react';
import { Loader2, FileWarning } from 'lucide-react';
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {FILE_GET} from "../../constant/Endpoint.tsx";
import {METHOD} from "../../constant/ApplicationConstant.js";

const SecureImage = ({ fileUrl, className, alt }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { authenticatedRequest } = useAuthApi();
    const initializtionRef = useRef(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await authenticatedRequest({}, `${FILE_GET}/${fileUrl?.replace("/uploads/", "")}`, METHOD.GET, { responseType: 'blob' });
                if (response.data === undefined) throw new Error('Failed to load');
                const blob = await response?.data;
                const objectUrl = URL.createObjectURL(blob);
                setImageSrc(objectUrl);
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (fileUrl) {
            if(!initializtionRef.current) {
                initializtionRef.current = true;
                fetchImage()
            }
        } else {
            setLoading(false);
        };

        // Cleanup the memory when component unmounts
        return () => {
            if (imageSrc) URL.revokeObjectURL(imageSrc);
        };
    }, []);

    if (loading) return <div className={`${className} flex items-center justify-center bg-slate-100`}><Loader2 className="animate-spin text-slate-400" /></div>;
    if (error) return <div className={`${className} flex items-center justify-center bg-red-50`}><FileWarning className="text-red-300" /></div>;

    return <img src={imageSrc} alt={alt} className={className}  />;
};

export default SecureImage;
