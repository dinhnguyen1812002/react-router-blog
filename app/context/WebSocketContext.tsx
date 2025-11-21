import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '~/store/authStore';
import { env } from '~/config/env';

interface WebSocketContextType {
    client: Client | null;
    connected: boolean;
    subscribe: (topic: string, callback: (message: any) => void) => StompSubscription | undefined;
    send: (destination: string, body: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [connected, setConnected] = useState(false);
    const { isAuthenticated, user } = useAuthStore();
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        // Only connect if authenticated (or if you want public sockets too, adjust logic)
        // For now, we'll connect generally, but user queues might need auth headers if secured

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(env.WS_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Global STOMP Connected');
                setConnected(true);
            },
            onDisconnect: () => {
                console.log('Global STOMP Disconnected');
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('Global STOMP error:', frame);
            },
        });

        // If using JWT, you might need to add headers here:
        // stompClient.connectHeaders = {
        //   Authorization: `Bearer ${token}`
        // };

        stompClient.activate();
        setClient(stompClient);
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    const subscribe = useCallback((topic: string, callback: (message: any) => void) => {
        if (!clientRef.current || !clientRef.current.connected) {
            console.warn('STOMP client not connected, cannot subscribe to', topic);
            return undefined;
        }

        return clientRef.current.subscribe(topic, (message: IMessage) => {
            try {
                const parsedBody = JSON.parse(message.body);
                callback(parsedBody);
            } catch (e) {
                console.error('Error parsing message body', e);
                // Fallback for non-JSON messages if needed
                callback(message.body);
            }
        });
    }, [connected]); // Re-create if connection status changes might be needed, but clientRef handles the instance

    const send = useCallback((destination: string, body: any) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        } else {
            console.warn('STOMP client not connected, cannot send to', destination);
        }
    }, []);

    return (
        <WebSocketContext.Provider value={{ client, connected, subscribe, send }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
