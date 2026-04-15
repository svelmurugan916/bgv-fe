import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Trash2, Check, AlertCircle, X, Circle } from "lucide-react";

const LivePhotoCapture = ({ title, capturedFile, onCapture, onRemove, error }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [stream, setStream] = useState(null);

    // Sync preview if a file already exists in form state
    useEffect(() => {
        if (capturedFile instanceof File) {
            const url = URL.createObjectURL(capturedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [capturedFile]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });
            setStream(mediaStream);
            setIsCameraOpen(true);

            // We need to wait for state to update and video element to render
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error("Camera Error:", err);
            alert("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext("2d");
            // Set canvas to match the video's actual resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
                onCapture(file);
                stopCamera();
            }, "image/jpeg", 0.9);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onRemove();
    };

    return (
        <div className={`relative flex flex-col p-5 border-2 rounded-[2rem] transition-all ${
            error ? 'bg-rose-50/50 border-rose-200' :
                previewUrl ? 'bg-white border-emerald-100' : 'bg-white border-slate-100'
        }`}>

            {/* --- FULL SCREEN CAMERA OVERLAY --- */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
                    {/* Header with Title and Close */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent z-10">
                        <div className="text-white">
                            <h4 className="font-black text-sm uppercase tracking-widest">{title}</h4>
                            <p className="text-[10px] text-white/60 font-bold uppercase">Position the camera clearly</p>
                        </div>
                        <button
                            onClick={stopCamera}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Viewfinder */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Footer with Capture Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col items-center bg-gradient-to-t from-black/70 to-transparent">
                        <button
                            onClick={takePhoto}
                            className="group relative flex items-center justify-center"
                        >
                            {/* Outer Ring */}
                            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform group-active:scale-90">
                                {/* Inner Shutter Button */}
                                <div className="w-16 h-16 bg-white rounded-full border-2 border-transparent" />
                            </div>
                        </button>
                        <p className="mt-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Capture Photo</p>
                    </div>
                </div>
            )}

            {/* --- NORMAL CARD VIEW --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* SMALL PREVIEW WINDOW */}
                <div className="relative w-full md:w-48 h-32 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-2 border-white shrink-0">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Capture" className="w-full h-full object-cover animate-in fade-in" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <Camera size={32} strokeWidth={1.5} />
                            <span className="text-[8px] font-black uppercase mt-2 tracking-widest">Ready to Capture</span>
                        </div>
                    )}

                    {previewUrl && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <Check size={12} strokeWidth={4} />
                        </div>
                    )}
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 text-center md:text-left">
                    <h4 className="font-black text-slate-800 text-sm lg:text-base">{title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {previewUrl ? "Live capture verified" : "Live camera capture required"}
                    </p>
                    {error && (
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-rose-600">
                            <AlertCircle size={12}/>
                            <p className="text-[9px] font-black uppercase">{error}</p>
                        </div>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                    {previewUrl ? (
                        <>
                            <button
                                onClick={handleRemove}
                                className="p-3 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={startCamera}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2"
                            >
                                <RefreshCw size={14} /> Retake
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={startCamera}
                            className="bg-[#5D4591] text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-[#5D4591]/20 active:scale-95 transition-all"
                        >
                            <Camera size={14} /> Open Camera
                        </button>
                    )}
                </div>
            </div>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default LivePhotoCapture;
