import React, {useEffect, useState} from 'react';
import { Navigation, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from "../../provider/FormProvider.jsx";
import FormPageHeader from "../bgv-form/FormPageHeader.jsx";

const GeoLocationStep = ({candidateDataResponse}) => {
    const { formData, updateFormData, errors, clearError } = useForm();
    const avData = formData.addressVerification;
    const addressInfo = formData.addressVerification.addressInfo || {};

    useEffect(() => {
        const address = candidateDataResponse?.candidateAddress;
        updateFormData('addressVerification', {
            ...avData,
                addressInfo: {
                    addressLine1: address?.addressLine1,
                    addressLine2: address?.addressLine2,
                    city: address?.city,
                    state: address?.state,
                    pincode: address?.pincode,
                    country: address?.country,
                }
        })
    }, [])

    // --- INITIALIZE LOCAL UI STATES ---
    const [loading, setLoading] = useState(false);
    const [locationError, setLocationError] = useState(null); // Local error state

    // --- THE CAPTURE FUNCTION ---
    const handleCaptureLocation = () => {
        setLoading(true);
        setLocationError(null); // Clear previous errors on new attempt

        const options = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                console.log(latitude, longitude, accuracy);
                // Mock Location / Accuracy Check
                if (accuracy > 100) {
                    setLocationError("Poor GPS accuracy. Please move to an open area or disable VPN.");
                } else {
                    // Update Global Form Data
                    updateFormData('addressVerification', {
                        ...avData,
                        location: {
                            lat: latitude,
                            long: longitude,
                            accuracy: accuracy
                        }
                    });
                    // Clear the global validation error if it existed
                    clearError('av_location');
                }
                setLoading(false);
            },
            (err) => {
                setLoading(false);
                // Handle specific hardware/permission failures
                if (err.code === 1) setLocationError("Permission Denied. Please allow location access.");
                else if (err.code === 2) setLocationError("GPS Signal Lost (kCLErrorLocationUnknown). Move near a window.");
                else if (err.code === 3) setLocationError("Request timed out. Please try again.");
                else setLocationError("An unknown location error occurred.");
            },
            options
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FormPageHeader heading="GPS Check-In" helperText="You must be physically present at the address to verify." />

            <div className="p-6 bg-[#F9F7FF]/50 border border-[#5D4591]/10 rounded-2xl mb-8 flex items-center gap-4">
                <div className="p-3 bg-[#5D4591] rounded-xl text-white shadow-lg shadow-[#5D4591]/10">
                    <MapPin size={24} />
                </div>
                <div>
                    <label className="text-[11px] font-bold text-[#241B3B] uppercase tracking-widest block">Verifying Address</label>
                    <p className="text-sm font-bold text-slate-700">
                        {`
                            ${candidateDataResponse?.candidateAddress?.addressLine1}, ${candidateDataResponse?.candidateAddress?.city}, ${candidateDataResponse?.candidateAddress?.state} - ${candidateDataResponse?.candidateAddress?.pincode}
                        `}
                    </p>
                </div>
            </div>

            {/* CAPTURE AREA */}
            <div id="av_location" className={`p-10 border-2 border-dashed rounded-[2rem] text-center transition-all 
                ${avData.location.lat ? 'border-green-200 bg-green-50/20' : (locationError || errors.av_location) ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50/30'}`}>

                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Navigation className={`text-[#5D4591] ${loading ? 'animate-spin' : ''}`} size={32} />
                </div>

                {avData.location.lat ? (
                    <div className="flex flex-col items-center gap-2 animate-in zoom-in">
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm uppercase tracking-tight">
                            <CheckCircle2 size={18} /> Coordinates Locked
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Lat: {avData.location.lat.toFixed(5)} | Long: {avData.location.long.toFixed(5)}
                        </p>
                        {/* Option to re-capture if accuracy was just okay */}
                        <button onClick={handleCaptureLocation} className="mt-4 text-[10px] font-bold text-[#5D4591] uppercase hover:underline">Recapture</button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Capture Current Location</h3>
                        <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Click the button below to lock your coordinates. This is mandatory to proceed.</p>

                        {/* --- CALLING THE FUNCTION HERE --- */}
                        <button
                            onClick={handleCaptureLocation}
                            disabled={loading}
                            className="bg-[#5D4591] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#4a3675] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Verifying Signal...' : 'Get My Location'}
                        </button>
                    </>
                )}

                {/* --- DISPLAYING THE ERROR DATA HERE --- */}
                {(locationError || errors.av_location) && (
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-red-500 animate-in slide-in-from-top-1">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            {locationError || errors.av_location}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeoLocationStep;
