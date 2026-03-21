// src/components/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import {
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
    X,
    Zap, // The "sparkle" icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ToastNotification = ({ id, message, type, removeToast, subtitle, actionButtons = [], isVisible }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleClose = (e) => {
        if (e) e.stopPropagation(); // Prevent event propagation if clicking the close button
        removeToast(id); // Use the removeToast from context to trigger fade-out
    };

    // Define styles and icons based on notification type
    let typeIcon, iconBgColor, iconColor, titleColor;
    switch (type) {
        case 'success':
            typeIcon = <CheckCircle size={16} />;
            iconBgColor = 'bg-emerald-600';
            iconColor = 'text-white';
            titleColor = 'text-emerald-400';
            break;
        case 'warning':
            typeIcon = <AlertTriangle size={16} />;
            iconBgColor = 'bg-amber-600';
            iconColor = 'text-white';
            titleColor = 'text-amber-400';
            break;
        case 'error':
            typeIcon = <XCircle size={16} />;
            iconBgColor = 'bg-red-600';
            iconColor = 'text-white';
            titleColor = 'text-red-400';
            break;
        case 'info':
        default:
            typeIcon = <Info size={16} />;
            iconBgColor = 'bg-[#5D4591]'; // Primary app color
            iconColor = 'text-white';
            titleColor = 'text-[#5D4591]'; // Primary app color
            break;
    }

    const handleActionButtonClick = (e, button) => {
        e.stopPropagation(); // Crucial: Prevent parent toast click
        switch (button.actionType) {
            case 'navigate':
                navigate(button.payload.endpoint); // Navigate to the specified path
                break;
            case 'apiCall':
                // Implement your API call logic here
                console.log(`Performing API call: ${button.payload.method} ${button.payload.endpoint}`);
                // Example: authenticatedRequest(button.payload.body, button.payload.endpoint, button.payload.method);
                break;
            case 'custom':
                // For custom client-side logic, payload could be a string identifier
                console.log(`Custom action: ${button.payload}`);
                // You might dispatch a global event or call a specific handler here
                break;
            default:
                console.warn('Unknown action type:', button.actionType);
        }
        handleClose(); // Close toast after action
    };

    return (
        <div
            className={`
                relative flex flex-col p-4 rounded-xl shadow-lg border border-gray-700 bg-gray-800 text-gray-200
                transition-all duration-300 transform
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                max-w-xs w-full mb-3 pointer-events-auto
            `}
            role="alert"
        >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={18} />
            </button>

            <div className="flex items-start gap-3">
                {/* Type Icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconBgColor} ${iconColor} flex-shrink-0`}>
                    {typeIcon}
                </div>

                <div className="flex-1">
                    {/* Title */}
                    <div className="flex items-center gap-2 text-base font-bold mb-1">
                        <Zap size={16} className={`text-gray-400`} /> {/* Sparkle icon */}
                        <span className={`${titleColor}`}>{message}</span>
                    </div>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-sm text-gray-200 mb-2 leading-tight">
                            {subtitle}
                        </p>
                    )}

                    {/* Action Buttons */}
                    {actionButtons.length > 0 && (
                        <div className="flex gap-2 pt-2">
                            {actionButtons.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => handleActionButtonClick(e, button)}
                                    className={`
                                        px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors
                                        ${button.isPrimary ? 'bg-[#5D4591] text-white hover:bg-[#4a3675]' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}
                                    `}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToastNotification;
