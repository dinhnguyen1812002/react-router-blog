import { useEffect, useRef, useState, useCallback } from "react";
import { WebSocketService } from "~/services/websocket";
import { env } from "~/config/env";

export interface UseWebSocketOptions {
  url?: string;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  autoConnect?: boolean;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  connectionState: "disconnected" | "connecting" | "connected";
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (destination: string, callback: (message: any) => void) => string;
  unsubscribe: (subscriptionId: string) => void;
  send: (destination: string, message: any) => void;
  error: string | null;
}

const DEFAULT_WS_URL = env.API_BASE_URL.replace("/api/v1", "/ws");

export function useWebSocket(
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    url = DEFAULT_WS_URL,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    autoConnect = true,
  } = options;

  // Debug logging
  if (env.DEV) {
    console.log("WebSocket URL:", url);
  }

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  const wsServiceRef = useRef<WebSocketService | null>(null);

  const initializeWebSocket = useCallback(() => {
    if (wsServiceRef.current) return;

    wsServiceRef.current = new WebSocketService(
      {
        url,
        reconnectDelay,
        maxReconnectAttempts,
      },
      {
        onConnect: () => {
          setIsConnected(true);
          setConnectionState("connected");
          setError(null);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setConnectionState("disconnected");
        },
        onError: (err) => {
          setError(err.message || "WebSocket connection error");
          setConnectionState("disconnected");
        },
      }
    );
  }, [url, reconnectDelay, maxReconnectAttempts]);

  const connect = useCallback(async () => {
    if (!wsServiceRef.current) {
      initializeWebSocket();
    }

    if (wsServiceRef.current) {
      setConnectionState("connecting");
      setError(null);
      try {
        await wsServiceRef.current.connect();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
        setConnectionState("disconnected");
      }
    }
  }, [initializeWebSocket]);

  const disconnect = useCallback(() => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
    }
  }, []);

  const subscribe = useCallback(
    (destination: string, callback: (message: any) => void): string => {
      if (!wsServiceRef.current) {
        throw new Error("WebSocket not initialized");
      }
      return wsServiceRef.current.subscribe(destination, callback);
    },
    []
  );

  const unsubscribe = useCallback((subscriptionId: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.unsubscribe(subscriptionId);
    }
  }, []);

  const send = useCallback((destination: string, message: any) => {
    if (!wsServiceRef.current) {
      throw new Error("WebSocket not initialized");
    }
    wsServiceRef.current.send(destination, message);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      initializeWebSocket();
      connect();
    }

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, [autoConnect, connect, initializeWebSocket]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
    error,
  };
}
