// src/components/listener/SSEListener.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { useNotification } from "../../context/NotificationContext.jsx";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";

const SSEListener = ({ onNotification }) => {
    const { addToast } = useNotification();
    const { accessToken } = useAuthApi();
    const eventStreamReaderRef = useRef(null); // Ref to hold the active stream reader
    const reconnectTimeoutRef = useRef(null);
    const isComponentMounted = useRef(true); // To track component mount state
    const abortControllerRef = useRef(null); // To manage fetch cancellation

    const API_BASE = import.meta.env.VITE_API_URL || "";
    const sseUrl = `${API_BASE}/api/v1/sse/notifications`;

    const RECONNECT_DELAY_MS = 5000;

    // Helper to clear any pending reconnect attempts
    const clearReconnectTimeout = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    // Helper to close the current SSE connection (if any)
    const closeSSEConnection = useCallback(() => {
        console.log("SSEListener: Attempting to close existing SSE connection.");
        clearReconnectTimeout(); // Clear any pending reconnects when closing

        if (eventStreamReaderRef.current) {
            try {
                // Cancel the reader to stop the `while` loop in `connectSSE`
                // Providing a reason can help differentiate between explicit close and other errors.
                eventStreamReaderRef.current.cancel('SSEListener component unmounted or reconnected');
                console.log("SSE reader cancelled.");
            } catch (e) {
                console.error("Error cancelling SSE reader:", e);
            }
            eventStreamReaderRef.current = null;
        }

        if (abortControllerRef.current) {
            // Abort the fetch request if it's still in progress
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, [clearReconnectTimeout]);


    // Function to establish the SSE connection
    const connectSSE = useCallback(async () => {
        console.log("connectSSE function called");

        // --- CRITICAL CHANGE: Ensure any previous connection/reconnect is cleaned up before starting a new one ---
        // This is crucial for idempotency and preventing duplicate connections.
        // If this function is called, it means we intend to establish a *new* connection,
        // so any old ones must be properly shut down first.
        closeSSEConnection();

        if (!accessToken) {
            console.warn("SSEListener: No authentication token found. Cannot establish authenticated SSE connection.");
            // Schedule a reconnect attempt if token is missing, assuming it might become available later
            if (isComponentMounted.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting to reconnect SSE due to missing token...");
                    connectSSE(); // Try connecting again
                }, RECONNECT_DELAY_MS);
            }
            return;
        }

        // Initialize a new AbortController for this fetch request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            console.log("SSE connection attempt initiated via fetch.");
            const response = await fetch(sseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Authorization': `Bearer ${accessToken}`,
                },
                signal: signal, // Attach the abort signal to the fetch request
            });

            if (!response.ok) {
                console.error(`SSE fetch error: ${response.status} ${response.statusText}`);
                if (response.status === 401 || response.status === 403) {
                    addToast("Session expired or unauthorized for notifications.", "error", RECONNECT_DELAY_MS);
                    // Depending on your auth flow, you might want to trigger a logout/refresh here
                    // or let the AuthApiProvider handle it.
                }
                // Only schedule reconnect if the component is still mounted
                if (isComponentMounted.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log("Attempting to reconnect SSE after fetch error...");
                        connectSSE(); // Try connecting again
                    }, RECONNECT_DELAY_MS);
                }
                abortControllerRef.current = null; // Clear controller on error
                return;
            }

            console.log("SSE connection opened via fetch.");

            const reader = response.body.getReader();
            eventStreamReaderRef.current = reader; // Store the active reader

            let buffer = '';
            const decoder = new TextDecoder();

            // Loop to read the stream, checking both component mount status and abort signal
            while (isComponentMounted.current && !signal.aborted) {
                const { done, value } = await reader.read();

                if (done) {
                    console.log("SSE stream closed by server (done).");
                    break; // Exit loop, will trigger reconnect below
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                let eventEndIndex;
                while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
                    const rawEventBlock = buffer.substring(0, eventEndIndex + 2);
                    buffer = buffer.substring(eventEndIndex + 2);

                    const tempEvent = { data: '', event: 'message', id: null };
                    const lines = rawEventBlock.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            tempEvent.data += line.substring(5);
                        } else if (line.startsWith('event:')) {
                            tempEvent.event = line.substring(6).trim();
                        } else if (line.startsWith('id:')) {
                            tempEvent.id = line.substring(3).trim();
                        }
                    }

                    if (tempEvent.data) {
                        processEvent(tempEvent);
                    }
                }
            }
            // If the loop exits (stream done or signal aborted), clean up and potentially reconnect
            eventStreamReaderRef.current = null; // Clear reader ref as stream is done or cancelled
            abortControllerRef.current = null; // Clear controller
            // Only schedule a reconnect if the component is still mounted AND the connection wasn't explicitly aborted
            if (isComponentMounted.current && !signal.aborted) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting to reconnect SSE after stream closure...");
                    connectSSE(); // Try connecting again
                }, RECONNECT_DELAY_MS);
            }

        } catch (error) {
            // Check if the error was due to cancellation
            if (signal.aborted) {
                console.log("SSE fetch connection aborted by AbortController (expected on cleanup).");
            } else {
                console.error("SSE fetch connection error:", error);
                if (isComponentMounted.current) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log("Attempting to reconnect SSE after unexpected error...");
                        connectSSE(); // Try connecting again
                    }, RECONNECT_DELAY_MS);
                }
            }
            eventStreamReaderRef.current = null; // Ensure reader ref is cleared on error
            abortControllerRef.current = null; // Clear controller
        }
    }, [sseUrl, accessToken, addToast, closeSSEConnection]); // Dependencies for useCallback

    const processEvent = useCallback((eventObj) => {
        if (eventObj.event === 'newNotification' && eventObj.data) {
            try {
                const notificationData = JSON.parse(eventObj.data);
                if (onNotification) {
                    onNotification(notificationData);
                }
                const clientActionButtons = notificationData.actionButtons?.map(btn => ({
                    label: btn.label,
                    isPrimary: btn.isPrimary,
                    actionType: btn.actionType,
                    payload: btn.payload
                })) || [];

                addToast(
                    notificationData.message,
                    notificationData.type,
                    notificationData.duration,
                    notificationData.subtitle,
                    clientActionButtons
                );
            } catch (error) {
                console.error("Failed to parse SSE message data (JSON error):", error, eventObj.data);
                addToast("Received malformed notification data.", "error", RECONNECT_DELAY_MS, "Please check server logs.");
            }
        } else {
            console.log(`Received SSE event '${eventObj.event}' (not 'newNotification' or no data to process):`, eventObj.data);
        }
    }, [addToast]); // Dependencies for useCallback

    useEffect(() => {
        console.log("SSEListener useEffect triggered");
        isComponentMounted.current = true; // Mark component as mounted

        if (!sseUrl) {
            console.warn("SSEListener: sseUrl is not provided. SSE connection will not be established.");
            closeSSEConnection(); // Ensure any existing connection is closed if URL becomes invalid
            return;
        }

        // --- CRITICAL CHANGE: Call connectSSE to establish the connection ---
        // This will automatically handle closing any previous connection and starting a new one
        // if sseUrl or accessToken changes.
        connectSSE();

        // --- Cleanup function for useEffect ---
        return () => {
            console.log("SSEListener cleanup function running");
            isComponentMounted.current = false; // Mark component as unmounted
            console.log("SSEListener unmounting, closing connection and clearing reconnects.");
            closeSSEConnection(); // Clean up on unmount or before re-running the effect
        };
    }, [sseUrl, accessToken, connectSSE, closeSSEConnection]); // Dependencies for useEffect

    return null;
};

export default SSEListener;
