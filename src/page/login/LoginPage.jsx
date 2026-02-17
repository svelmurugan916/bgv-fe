import React, { useState, useEffect, useRef, useCallback } from 'react';
import {ShieldCheck, Shield, MapPinIcon, Zap, ChevronRight, ChevronRightIcon} from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import {VERIFY_OTP, RESEND_OTP, VALIDATE_RESET_TOKEN} from "../../constant/Endpoint.tsx";
import {EMAIL_REGEX, METHOD} from "../../constant/ApplicationConstant.js";
import LoginPanel from './LoginPanel';
import MfaPanel from './MfaPanel';
import {replace, useNavigate, useSearchParams} from "react-router-dom";
import ResetPasswordView from "./ResetPasswordView.jsx";
import ForgotPasswordView from "./ForgotPasswordView.jsx";

const LoginPage = () => {
    const [step, setStep] = useState('login');
    const [tokenError, setTokenError] = useState('');
    const [isValidatingToken, setIsValidatingToken] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
    const [mfaResponseData, setMfaResponseData] = useState({});
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);

    const [searchParams] = useSearchParams();

    const validateToken = async (token) => {
        setIsValidatingToken(true);
        setStep('resetPassword');
        try {
            // Call backend to check if token exists and isn't expired
            const response = await unAuthenticatedRequest(undefined, `${VALIDATE_RESET_TOKEN}?token=${token}`, METHOD.GET);
            if(response.status !== 200 || response.data.success === false) {
                setTokenError(response.data?.message || "This link is invalid or has expired.");
            }
        } catch (err) {
            setTokenError("Unable to verify security link. Please try again.");
        } finally {
            setIsValidatingToken(false);
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');

        if (location.pathname === '/reset-password') {
            if (!token) {
                setTokenError("Invalid request. No security token found.");
                setStep('resetPassword');
                return;
            }
            validateToken(token);
        } else if (location.pathname === '/login') {
            setStep('login');
            setTokenError('');
            setError('');
        }
    }, [location.pathname, searchParams]);

    const navigate = useNavigate();

    const { login, setAuthData, unAuthenticatedRequest, setUser, setLoading, setAvailableRoles } = useAuthApi();
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Carousel Logic
    const [activeSlide, setActiveSlide] = useState(0);
    const slides = [
        {
            icon: <MapPinIcon size={40} />,
            title: "Digital Address Verification",
            desc: "Eliminate manual site visits. Our automated Geo-tagging system verifies candidate locations instantly.",
            image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
        },
        {
            icon: <Zap size={40} />,
            title: "AI-Powered Onboarding",
            desc: "Accelerate hiring with automated data extraction for Aadhar, PAN, and Voter IDs.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
        },
        {
            icon: <ShieldCheck size={40} />,
            title: "Secure Indian Infrastructure",
            desc: "Data privacy is our priority. Fully compliant with Indian data protection laws.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => setActiveSlide((prev) => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const validateForm = () => {
        let errors = { email: '', password: '' };
        let isValid = true;
        if (!email.trim() || !EMAIL_REGEX.test(email)) { errors.email = "Valid work email is required"; isValid = false; }
        if (!password || password.length < 6) { errors.password = "Password must be at least 6 characters"; isValid = false; }
        setFieldErrors(errors);
        return isValid;
    };

    const handleResendOtp = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const requestBody = { mfaSessionId: mfaResponseData?.mfaSessionId };
            const response = await unAuthenticatedRequest(requestBody, RESEND_OTP);
            const { data } = response;

            if (data.status === "SUCCESS") {
                setMfaResponseData(data.responseData);
                setOtp(['', '', '', '', '', '']);
                console.log("OTP Resent successfully:", data.message);
            } else {
                setError(data.message || "Failed to resend OTP");
            }
        } catch (err) {
            setError( err.response.data.message || "Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [mfaResponseData, unAuthenticatedRequest]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !executeRecaptcha) return;
        setIsLoading(true);
        setError('');
        try {
            const token = await executeRecaptcha('login');
            const response = await login({ email, password, recaptchaToken: token });
            if (response.status === 200) {
                setMfaResponseData(response.data.responseData);
                setStep('mfa');
            } else { setError(response.message || "Login failed"); }
        } catch (err) { setError("Security check failed. Please try again."); }
        finally { setIsLoading(false); }
    };

    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) { setError("Please enter all 6 digits"); return; }

        setIsLoading(true); // Local loading for button spinner
        try {
            const response = await unAuthenticatedRequest({
                mfaSessionId: mfaResponseData?.mfaSessionId,
                otpCode: fullOtp
            }, VERIFY_OTP);

            if (response.data.success) {
                const { responseData } = response.data;

                // 1. Set User and Token/Roles ATOMICALLY
                setAuthData(responseData.accessToken); // This decodes the JWT and sets roles
                setUser(responseData.user);

                // 2. Ensure global loading is false before navigating
                setLoading(false);

                if(!responseData?.roleSelectionRequired) {
                    // 3. Now navigate. ProtectedRoute will see user AND loggedInRole immediately.
                    navigate("/dashboard");
                } else {
                    setAvailableRoles(responseData?.availableRoles);
                    navigate("/select-role");
                }
            } else {
                setOtp(['', '', '', '', '', '']);
                setError(response.data.message);
            }
        } catch (err) {
            setError("Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
            {/* LEFT SIDE: CAROUSEL */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-slate-900">
                {slides.map((slide, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-40' : 'opacity-0'}`}>
                        <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#5D4591] via-transparent to-transparent opacity-80" />
                    </div>
                ))}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#5D4591] shadow-xl"><ShieldCheck size={24} /></div>
                    <h1 className="text-2xl font-black tracking-tight">Trace<span className="opacity-80">U</span></h1>
                </div>
                <div className="relative h-64 z-10">
                    {slides.map((slide, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-all duration-1000 transform ${idx === activeSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="mb-6 p-4 bg-white/10 w-fit rounded-xl backdrop-blur-md border border-white/20">{slide.icon}</div>
                            <h2 className="text-4xl font-bold mb-4 leading-tight">{slide.title}</h2>
                            <p className="text-[#F9F7FF] text-lg max-w-md font-medium">{slide.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 relative z-10">
                    {slides.map((_, idx) => <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />)}
                </div>
            </div>

            {/* RIGHT SIDE: FORM PANELS */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"><Shield size={600} strokeWidth={1} className="rotate-12 text-[#5D4591]" /></div>
                <div className="w-full max-w-md relative z-10">
                    {step === 'login' && (
                        <LoginPanel
                            email={email} setEmail={setEmail}
                            password={password} setPassword={setPassword}
                            fieldErrors={fieldErrors} setFieldErrors={setFieldErrors}
                            error={error} isLoading={isLoading}
                            onSubmit={handleLoginSubmit}
                            setStep={setStep}
                        />
                    )}
                    {step === 'mfa' &&  (
                        <MfaPanel
                            mfaResponseData={mfaResponseData}
                            otp={otp} setOtp={setOtp}
                            otpRefs={otpRefs}
                            error={error} setError={setError}
                            isLoading={isLoading}
                            onSubmit={handleMfaSubmit}
                            onResend={handleResendOtp}
                            onBack={() => setStep('login')}
                        />
                    )}
                    {step === 'forgotPassword' && (
                        <ForgotPasswordView onBack={() => setStep('login')} />
                    )}
                    {step === 'resetPassword' && (
                        <ResetPasswordView
                            token={searchParams.get('token')}
                            isValidating={isValidatingToken}
                            tokenError={tokenError}
                            onBack={() => navigate('/login', {replace: true})}
                        />
                    )}
                    {/* Common Footer */}
                    <div className="mt-20 pt-8 border-t border-slate-100 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2"><Shield size={14} className="text-[#5D4591]" /> ISO 27001</div>
                        <div className="flex items-center gap-2"><Shield size={14} className="text-[#5D4591]" /> DPDP Compliant</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
