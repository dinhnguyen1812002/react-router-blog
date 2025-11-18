// hooks/useNotificationWebSocket.ts
import { useEffect, useRef, useCallback, useState } from "react";

import { Client, type IMessage } from "@stomp/stompjs";

interface PostNotification {
  postId: string;
  title: string;
  slug: string;
  excerpt: string;
  publicDate: string;
}

interface UseNotificationWebSocketOptions {
  url: string;
  topics: string[];
  onMessage?: (data: PostNotification) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useNotificationWebSocket = ({
  url,
  topics,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseNotificationWebSocketOptions) => {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("WebSocket Connected");
        setConnected(true);
        onConnect?.();

        // Subscribe to all topics
        topics.forEach((topic) => {
          client.subscribe(topic, (message: IMessage) => {
            try {
              const data: PostNotification = JSON.parse(message.body);
              onMessage?.(data);
            } catch (error) {
              console.error("Error parsing message:", error);
              onError?.(error);
            }
          });
        });
      },

      onDisconnect: () => {
        console.log("WebSocket Disconnected");
        setConnected(false);
        onDisconnect?.();
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
        onError?.(frame);
      },
    });

    client.activate();
    stompClientRef.current = client;
  }, [url, topics, onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  }, []);

  const send = useCallback(
    (destination: string, body: any) => {
      if (stompClientRef.current && connected) {
        stompClientRef.current.publish({
          destination,
          body: JSON.stringify(body),
        });
      }
    },
    [connected],
  );

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { connected, disconnect, send };
};
