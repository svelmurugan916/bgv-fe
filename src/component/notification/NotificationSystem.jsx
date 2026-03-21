// src/components/NotificationSystem.jsx
import React from 'react';
import ToastNotification from './ToastNotification';
import {useNotification} from "../../context/NotificationContext.jsx";

const NotificationSystem = () => {
    const { toasts, removeToast, clearAllToasts } = useNotification();

    // Use a transition group if you want more complex exit animations for individual toasts
    return (
        <div className="fixed top-6 right-6 z-[1000] flex flex-col items-end pointer-events-none">
            {/* Clear All Button */}
            {toasts.length > 0 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent clicking through to elements below
                        clearAllToasts();
                    }}
                    className="pointer-events-auto px-4 py-2 mb-3 text-sm font-bold rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors shadow-md"
                >
                    Clear All ({toasts.length})
                </button>
            )}

            {toasts.map((toast) => (
                <ToastNotification
                    key={toast.id}
                    {...toast}
                    removeToast={removeToast}
                />
            ))}
        </div>
    );
};

export default NotificationSystem;
