import { env } from '~/config/env';

// Declare SockJS and Stomp types
declare global {
  interface Window {
    SockJS: any;
    Stomp: any;
  }
}

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
  private socket: any = null;
  private stompClient: any = null;
  private config: WebSocketConfig;
  private callbacks: WebSocketCallbacks;
  private subscriptions: Map<string, any> = new Map();
  private reconnectAttempts = 0;
  private isConnecting = false;
  private isConnected = false;

  constructor(config: WebSocketConfig, callbacks: WebSocketCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
  }

  async loadWebSocketLibraries(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Load SockJS if not already loaded
    if (!window.SockJS) {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js');
    }

    // Load Stomp if not already loaded
    if (!window.Stomp) {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js');
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  async connect(): Promise<void> {
    if (this.isConnecting || this.isConnected) return;

    try {
      this.isConnecting = true;
      await this.loadWebSocketLibraries();

      this.socket = new window.SockJS(this.config.url);
      this.stompClient = window.Stomp.over(this.socket);

      // Disable debug logging in production
      if (env.PROD) {
        this.stompClient.debug = null;
      }

      return new Promise((resolve, reject) => {
        this.stompClient.connect(
          {},
          (frame: any) => {
            console.log('WebSocket connected:', frame);
            this.isConnected = true;
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.callbacks.onConnect?.();
            resolve();
          },
          (error: any) => {
            console.error('WebSocket connection error:', error);
            this.isConnecting = false;
            this.isConnected = false;
            this.callbacks.onError?.(error);
            this.handleReconnect();
            reject(error);
          }
        );
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.stompClient && this.isConnected) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.callbacks.onDisconnect?.();
      });
    }
  }

  subscribe(destination: string, callback: (message: any) => void): string {
    if (!this.isConnected || !this.stompClient) {
      throw new Error('WebSocket not connected');
    }

    const subscription = this.stompClient.subscribe(destination, (message: any) => {
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
    if (!this.isConnected || !this.stompClient) {
      throw new Error('WebSocket not connected');
    }

    this.stompClient.send(destination, {}, JSON.stringify(message));
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