import React, { useEffect, useRef, useCallback } from 'react';
import { useNotification } from "../../context/NotificationContext.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";

const SSEListener = ({ onNotification }) => {
    const { addToast } = useNotification();
    const { getCurrentAccessToken } = useAuthApi();

    // Connection & Lifecycle Refs
    const eventStreamReaderRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);
    const isComponentMounted = useRef(true);

    // Resilience Configuration
    const reconnectAttemptsRef = useRef(0);
    const authErrorShownRef = useRef(false);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const INITIAL_DELAY_MS = 5000;

    const API_BASE = import.meta.env.VITE_API_URL || "";
    const sseUrl = `${API_BASE}/api/v1/sse/notifications`;

    /**
     * Helper: Closes existing connections and clears pending timeouts
     */
    const closeSSEConnection = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (eventStreamReaderRef.current) {
            try {
                eventStreamReaderRef.current.cancel('Reconnecting or Unmounting');
            } catch (e) {
                console.error("SSE Reader Cancel Error:", e);
            }
            eventStreamReaderRef.current = null;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    /**
     * Helper: Schedules a reconnection with exponential backoff
     */
    const scheduleReconnect = useCallback((reason) => {
        if (!isComponentMounted.current) return;

        if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
            console.error(`SSEListener: Max attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Stopping. Reason: ${reason}`);
            return;
        }

        const delay = INITIAL_DELAY_MS * Math.pow(2, reconnectAttemptsRef.current);
        reconnectAttemptsRef.current += 1;

        console.log(`Retrying SSE (Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms. Reason: ${reason}`);

        reconnectTimeoutRef.current = setTimeout(() => {
            connectSSE();
        }, delay);
    }, []);

    /**
     * Core: Establishes the SSE fetch stream
     */
    const connectSSE = useCallback(async () => {
        console.log("SSE: connectSSE initiated.");
        closeSSEConnection();

        if (!getCurrentAccessToken) {
            scheduleReconnect("No authentication token found.");
            return;
        }

        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        try {
            const accessToken = await getCurrentAccessToken();
            const response = await fetch(sseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Authorization': `Bearer ${accessToken}`,
                },
                signal,
            });

            if (!response.ok) {
                // Throttle Auth Error Toasts
                if ((response.status === 401 || response.status === 403) && !authErrorShownRef.current) {
                    addToast("Session expired. Notifications paused.", "error", 5000);
                    authErrorShownRef.current = true;
                }
                throw new Error(`HTTP ${response.status}`);
            }

            // --- CONNECTION SUCCESS ---
            console.log("SSE: Connection opened successfully.");
            reconnectAttemptsRef.current = 0;
            authErrorShownRef.current = false;

            const reader = response.body.getReader();
            eventStreamReaderRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = '';

            while (isComponentMounted.current && !signal.aborted) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let eventEndIndex;
                while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
                    const rawBlock = buffer.substring(0, eventEndIndex + 2);
                    buffer = buffer.substring(eventEndIndex + 2);
                    parseAndProcess(rawBlock);
                }
            }

            if (!signal.aborted) scheduleReconnect("Stream closed by server.");

        } catch (error) {
            if (!signal.aborted) {
                console.error("SSE Connection Error:", error);
                scheduleReconnect(error.message);
            }
        }
    }, [sseUrl, getCurrentAccessToken, addToast, closeSSEConnection, scheduleReconnect]);

    /**
     * Helper: Parses raw SSE blocks into event objects
     */
    const parseAndProcess = (block) => {
        const eventObj = { data: '', event: 'message', id: null };
        block.split('\n').forEach(line => {
            if (line.startsWith('data:')) eventObj.data += line.substring(5);
            else if (line.startsWith('event:')) eventObj.event = line.substring(6).trim();
            else if (line.startsWith('id:')) eventObj.id = line.substring(3).trim();
        });

        if (eventObj.event === 'newNotification' && eventObj.data) {
            try {
                const notification = JSON.parse(eventObj.data);
                if (onNotification) onNotification(notification);

                const actionButtons = notification.actionButtons?.map(btn => ({
                    label: btn.label,
                    isPrimary: btn.isPrimary,
                    actionType: btn.actionType,
                    payload: btn.payload
                })) || [];

                addToast(
                    notification.message,
                    notification.type,
                    notification.duration,
                    notification.subtitle,
                    actionButtons
                );
            } catch (e) {
                console.error("SSE JSON Parse Error:", e);
            }
        }
    };

    /**
     * Lifecycle: Mount and Unmount
     */
    useEffect(() => {
        isComponentMounted.current = true;
        connectSSE();

        return () => {
            console.log("SSE: Unmounting listener.");
            isComponentMounted.current = false;
            closeSSEConnection();
        };
    }, [connectSSE, closeSSEConnection]);

    return null;
};

export default SSEListener;
