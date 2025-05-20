class NotificationWebSocket {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        this.reconnectInterval = options.reconnectInterval || 5000;
        this.onMessage = options.onMessage || (() => {});
        this.onConnected = options.onConnected || (() => {});
        this.onDisconnected = options.onDisconnected || (() => {});
        this.onError = options.onError || (() => {});
        this.isConnecting = false;
        this.isInitialized = false;
    }

    async connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.isConnecting = true;

        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.isInitialized = true;

                // Send authentication message
                const authMessage = {
                    type: 'auth',
                    restaurantId: localStorage.getItem('restaurantId'),
                    token: localStorage.getItem('token')
                };
                this.send(authMessage);

                this.onConnected();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.onMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnecting = false;
                this.onDisconnected();
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
                this.onError(error);
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            this.isConnecting = false;
            this.onError(error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.isInitialized) {
            return;
        }

        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        setTimeout(() => {
            this.connect();
        }, this.reconnectInterval);
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected, cannot send message');
        }
    }

    close() {
        if (this.ws) {
            this.isInitialized = false;
            this.ws.close();
        }
    }
}

let notificationWs = null;

export const initializeNotifications = (options = {}) => {
    if (!notificationWs) {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8081/ws/notifications';
        notificationWs = new NotificationWebSocket(wsUrl, options);
    }
    return notificationWs;
};

export const closeNotifications = () => {
    if (notificationWs) {
        notificationWs.close();
        notificationWs = null;
    }
};

export default {
    initializeNotifications,
    closeNotifications
};
