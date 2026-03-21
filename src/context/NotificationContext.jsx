// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // addToast now accepts structured actionButtons:
    // [{ label: string, isPrimary?: boolean, actionType: 'navigate' | 'apiCall' | 'custom', payload: any }]
    const addToast = useCallback((message, type = 'info', duration = 5000, subtitle = null, actionButtons = []) => {
        const id = uuidv4();
        const newToast = { id, message, type, duration, subtitle, actionButtons, isVisible: true }; // isVisible for exit animation
        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Auto-dismiss after duration
        // setTimeout(() => {
        //     removeToast(id);
        // }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) => (toast.id === id ? { ...toast, isVisible: false } : toast))
        );
        // Remove from DOM after fade-out
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, 300); // Match CSS transition duration
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts((prevToasts) => prevToasts.map(toast => ({ ...toast, isVisible: false })));
        setTimeout(() => setToasts([]), 300); // Wait for fade-out animation
    }, []);

    const value = {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
