import { env } from '~/config/env';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// This service uses @stomp/stompjs with SockJS via a WebSocket factory.

export interface WebSocketConfig {
  url: string;
  reconnectDelay: number;
  maxReconnectAttempts: number;
}

export interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (destination: string, message: any) => void;
}

export class WebSocketService {
  private client: Client | null = null;
  private config: WebSocketConfig;
  private callbacks: WebSocketCallbacks;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private isConnecting = false;
  private isConnected = false;

  constructor(config: WebSocketConfig, callbacks: WebSocketCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
  }

  async connect(): Promise<void> {
    if (this.isConnecting || this.isConnected) return;

    try {
      this.isConnecting = true;
      // Create STOMP client using SockJS factory. We manage reconnection manually.
      this.client = new Client({
        webSocketFactory: () => new SockJS(this.config.url),
        reconnectDelay: 0,
        debug: (msg: string) => {
          if (!env.PROD) console.log(msg);
        },
      });

      return new Promise((resolve, reject) => {
        if (!this.client) return reject(new Error('STOMP client not initialized'));

        this.client.onConnect = (frame) => {
          console.log('WebSocket connected:', frame.headers);
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.callbacks.onConnect?.();
          resolve();
        };

        this.client.onStompError = (frame) => {
          const errorMsg = frame.headers['message'] || 'STOMP error';
          console.error('STOMP error:', errorMsg, frame.body);
          this.callbacks.onError?.(new Error(errorMsg));
        };

        this.client.onWebSocketClose = (evt) => {
          console.warn('WebSocket closed:', evt.reason || evt.code);
          this.isConnected = false;
          this.isConnecting = false;
          this.callbacks.onDisconnect?.();
          this.handleReconnect();
        };

        this.client.onWebSocketError = (evt) => {
          console.error('WebSocket error:', evt);
          this.callbacks.onError?.(evt);
        };

        try {
          this.client.activate();
        } catch (err) {
          this.isConnecting = false;
          this.isConnected = false;
          this.callbacks.onError?.(err);
          this.handleReconnect();
          reject(err);
        }
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (!this.client) return;

    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((subscription) => {
      try { subscription.unsubscribe(); } catch {}
    });
    this.subscriptions.clear();

    try {
      this.client.deactivate().finally(() => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.callbacks.onDisconnect?.();
      });
    } catch {
      this.isConnected = false;
      this.callbacks.onDisconnect?.();
    }
  }

  subscribe(destination: string, callback: (message: any) => void): string {
    if (!this.isConnected || !this.client) {
      throw new Error('WebSocket not connected');
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
        this.callbacks.onMessage?.(destination, parsedMessage);
      } catch (error) {
        // If not JSON, treat as plain text
        callback(message.body);
        this.callbacks.onMessage?.(destination, message.body);
      }
    });

    const subscriptionId = `${destination}_${Date.now()}`;
    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
    }
  }

  send(destination: string, message: any): void {
    if (!this.isConnected || !this.client) {
      throw new Error('WebSocket not connected');
    }

    this.client.publish({ destination, body: JSON.stringify(message) });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  getConnectionState(): 'disconnected' | 'connecting' | 'connected' {
    if (this.isConnected) return 'connected';
    if (this.isConnecting) return 'connecting';
    return 'disconnected';
  }
}