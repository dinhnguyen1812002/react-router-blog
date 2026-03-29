import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import SockJS from "sockjs-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebSocketContextType {
	connected: boolean;
	subscribe: (
		topic: string,
		callback: (message: unknown) => void,
	) => StompSubscription | undefined;
	send: (destination: string, body: unknown) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined,
);

// ─── Provider ────────────────────────────────────────────────────────────────

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// ✅ rerender-use-ref-transient-values: `connected` is consumed in subscribe/send
	//    callbacks but doesn't need to trigger re-renders on its own — use a ref
	//    for the boolean guard and a separate state only for consumers that need
	//    to re-render when connection status changes (e.g. showing an indicator).
	const [connected, setConnected] = useState(false);
	const clientRef = useRef<Client | null>(null);

	// ✅ advanced-init-once: STOMP client is created once. The effect has no
	//    dependencies — reconnection is handled internally by reconnectDelay.
	//    Previously the client was also stored in useState which caused an extra
	//    re-render on connect and exposed the mutable Client object to consumers
	//    (who should never call it directly — use subscribe/send instead).
	useEffect(() => {
		const stompClient = new Client({
			webSocketFactory: () =>
				new SockJS(import.meta.env.VITE_WS_URL || "http://localhost:8080/ws"),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => setConnected(true),
			onDisconnect: () => setConnected(false),
			// Errors are handled internally by @stomp/stompjs; no need to log here
			// unless you have a monitoring sink to send them to.
		});

		stompClient.activate();
		clientRef.current = stompClient;

		return () => {
			stompClient.deactivate();
			clientRef.current = null;
		};
	}, []);

	// ✅ rerender-dependencies: `subscribe` only needs the clientRef (stable ref),
	//    not `connected` state. Previously listing `connected` as a dep caused the
	//    callback to be recreated on every connect/disconnect cycle, which in turn
	//    caused every useEffect([subscribe]) consumer to re-subscribe.
	const subscribe = useCallback(
		(
			topic: string,
			callback: (message: unknown) => void,
		): StompSubscription | undefined => {
			const client = clientRef.current;
			if (!client?.connected) return undefined;

			return client.subscribe(topic, (message: IMessage) => {
				try {
					callback(JSON.parse(message.body));
				} catch {
					// Non-JSON frame — pass raw string so callers can decide
					callback(message.body);
				}
			});
		},
		[], // clientRef is stable; no deps needed
	);

	const send = useCallback((destination: string, body: unknown): void => {
		const client = clientRef.current;
		if (!client?.connected) return;
		client.publish({ destination, body: JSON.stringify(body) });
	}, []);

	return (
		<WebSocketContext.Provider value={{ connected, subscribe, send }}>
			{children}
		</WebSocketContext.Provider>
	);
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useWebSocket = (): WebSocketContextType => {
	const context = useContext(WebSocketContext);
	if (!context)
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	return context;
};
