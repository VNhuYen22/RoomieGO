// NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Context & Hook
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

// Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');

  const connectionAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const pendingNotificationsRef = useRef([]);
  const clientRef = useRef(null);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 5000;
  const MAX_PENDING_NOTIFICATIONS = 10;
  const CONNECTION_CHECK_INTERVAL = 30000;
  const CONNECTION_TIMEOUT = 10000;

  // Add new state for connection management
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionTimeoutRef = useRef(null);
  const connectionCheckIntervalRef = useRef(null);
  const reconnectInProgressRef = useRef(false);

  // Extract userId from token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const uid = payload.userId || payload.sub;
        if (uid) setUserId(uid);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() < payload.exp * 1000;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  const cleanupConnection = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    if (connectionCheckIntervalRef.current) {
      clearInterval(connectionCheckIntervalRef.current);
      connectionCheckIntervalRef.current = null;
    }

    if (clientRef.current) {
      try {
        clientRef.current.subscriptions.forEach(sub => sub.unsubscribe());
        clientRef.current.client.deactivate();
        clientRef.current = null;
      } catch (error) {
        console.error("Error deactivating client:", error);
      }
    }

    setStompClient(null);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionState('DISCONNECTED');
  };

  const handleReconnect = () => {
    if (reconnectInProgressRef.current) {
      console.log("Reconnection already in progress, skipping...");
      return;
    }

    if (connectionAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
      connectionAttemptsRef.current++;
      const delay = Math.min(RECONNECT_DELAY * Math.pow(2, connectionAttemptsRef.current - 1), 30000);
      console.log(`Attempting reconnection ${connectionAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

      reconnectInProgressRef.current = true;
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Executing reconnection attempt...");
        reconnectInProgressRef.current = false;
        connectWebSocket();
      }, delay);
    } else {
      console.log("Max reconnection attempts reached, waiting before retry");
      setConnectionState('ERROR');
      reconnectInProgressRef.current = true;
      reconnectTimeoutRef.current = setTimeout(() => {
        connectionAttemptsRef.current = 0;
        reconnectInProgressRef.current = false;
        console.log("Resetting connection attempts and trying again");
        connectWebSocket();
      }, RECONNECT_DELAY * 2);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem("authToken");
    if (!token || !validateToken(token)) {
      console.error("WebSocket connection failed: Invalid or expired token");
      setConnectionState('ERROR');
      return;
    }

    if (!userId) {
      console.error("WebSocket connection failed: No user ID available");
      return;
    }

    if (isConnecting) {
      console.log("Connection attempt already in progress");
      return;
    }

    cleanupConnection();
    setConnectionState('CONNECTING');
    setIsConnecting(true);

    try {
      console.log("Initializing WebSocket connection...");
      
      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        console.error("Connection attempt timed out");
        cleanupConnection();
        handleReconnect();
      }, CONNECTION_TIMEOUT);

      // Initialize SockJS directly
      console.log("Initializing SockJS connection...");
      const socket = new SockJS("http://localhost:8080/ws", null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling', 'iframe-eventsource', 'iframe-htmlfile'],
        timeout: 20000,
        debug: true,
        sessionId: () => {
          const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
          console.log("Generated new session ID:", sessionId);
          return sessionId;
        },
        server: 'localhost:8080',
        protocols_whitelist: ['websocket', 'xhr-streaming', 'xhr-polling'],
        rtt: 1000,
        max_retries: 3
      });

      // Add connection event listeners
      socket.onopen = () => {
        console.log("SockJS connection opened successfully", {
          timestamp: new Date().toISOString(),
          userId: userId,
          hasToken: !!token,
          transport: socket._transport.name
        });
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      };

      socket.onclose = (event) => {
        console.error("SockJS connection closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
          userId: userId,
          transport: socket._transport?.name
        });
        if (!reconnectInProgressRef.current) {
          cleanupConnection();
          handleReconnect();
        }
      };

      socket.onerror = (error) => {
        console.error("SockJS error:", {
          error,
          timestamp: new Date().toISOString(),
          userId: userId,
          hasToken: !!token,
          transport: socket._transport?.name
        });
        if (!reconnectInProgressRef.current) {
          cleanupConnection();
          handleReconnect();
        }
      };

      // Initialize STOMP client
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          userId: userId,
          'X-CSRF-TOKEN': localStorage.getItem('csrfToken') || '',
          'Content-Type': 'application/json'
        },
        debug: (str) => {
          if (window.location.hostname === 'localhost') {
            console.log("STOMP Debug:", str);
          }
        },
        reconnectDelay: RECONNECT_DELAY,
        heartbeatIncoming: 5000,
        heartbeatOutgoing: 5000,
        onStompError: (frame) => {
          console.error("STOMP error:", {
            headers: frame.headers,
            body: frame.body,
            command: frame.command,
            timestamp: new Date().toISOString()
          });
          
          if (frame.headers.message?.includes('Unauthorized')) {
            console.error("Authentication failed - Invalid token or permissions");
            setConnectionState('AUTH_ERROR');
          } else {
            console.error("STOMP protocol error:", frame.headers.message);
            setConnectionState('ERROR');
          }
          if (!reconnectInProgressRef.current) {
            cleanupConnection();
            handleReconnect();
          }
        },
        onWebSocketClose: (event) => {
          console.error("WebSocket closed:", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            timestamp: new Date().toISOString()
          });
          if (!reconnectInProgressRef.current) {
            cleanupConnection();
            handleReconnect();
          }
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", {
            error: event,
            timestamp: new Date().toISOString()
          });
          if (!reconnectInProgressRef.current) {
            cleanupConnection();
            handleReconnect();
          }
        }
      });

      client.onConnect = (frame) => {
        console.log("Successfully connected to WebSocket", {
          frame,
          timestamp: new Date().toISOString()
        });
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionState('CONNECTED');
        connectionAttemptsRef.current = 0;
        reconnectInProgressRef.current = false;

        const headers = {
          Authorization: `Bearer ${token}`,
          userId: userId
        };

        console.log("Subscribing to notification channels...");
        
        const userSub = client.subscribe("/user/queue/notifications", (message) => {
          try {
            console.log("Received user notification:", {
              message,
              timestamp: new Date().toISOString()
            });
            const notification = JSON.parse(message.body);
            handleNotification(notification);
          } catch (err) {
            console.error("Error processing user notification:", err);
          }
        }, headers);

        const topicSub = client.subscribe(`/topic/notifications/${userId}`, (message) => {
          try {
            console.log("Received topic notification:", {
              message,
              timestamp: new Date().toISOString()
            });
            const notification = JSON.parse(message.body);
            handleNotification(notification);
          } catch (err) {
            console.error("Error processing topic notification:", err);
          }
        }, headers);

        clientRef.current = {
          client,
          subscriptions: [userSub, topicSub]
        };

        console.log("Processing any pending notifications...");
        processPendingNotifications();

        // Set up connection check interval
        connectionCheckIntervalRef.current = setInterval(() => {
          if (!client.connected && !reconnectInProgressRef.current) {
            console.log("Connection check failed - client not connected", {
              timestamp: new Date().toISOString()
            });
            cleanupConnection();
            handleReconnect();
          }
        }, CONNECTION_CHECK_INTERVAL);
      };

      console.log("Activating STOMP client...");
      client.activate();
      setStompClient(client);

    } catch (error) {
      console.error("Error setting up WebSocket connection:", {
        error,
        timestamp: new Date().toISOString()
      });
      cleanupConnection();
      handleReconnect();
    }
  };

  useEffect(() => {
    if (userId) {
      const cleanup = connectWebSocket();
      return () => {
        cleanupConnection();
        if (cleanup) cleanup();
      };
    }
  }, [userId]);

  const handleNotification = (payload) => {
    const notification = {
      id: Date.now().toString(),
      title: getNotificationTitle(payload.type),
      description: formatNotificationMessage(payload),
      type: payload.type,
      timestamp: payload.timestamp || new Date().toISOString(),
      read: false,
      data: payload.data,
      linkId: payload.data?.requestId || payload.data?.roomId
    };
    addNotification(notification);
  };

  const getNotificationTitle = (type) => {
    const titles = {
      RENT_REQUEST_VIEW_ROOM: "Yêu cầu xem phòng",
      VIEW_REQUEST_RESPONSE: "Phản hồi yêu cầu xem phòng",
      RENT_REQUEST_REJECTED: "Yêu cầu bị từ chối",
      VIEW_CONFIRMED: "Xác nhận xem phòng",
      TENANT_CONFIRMED_VIEWING: "Người thuê xác nhận xem phòng",
      RENT_REQUEST_APPROVED: "Yêu cầu được chấp nhận",
      ROOM_HIDDEN: "Phòng đã bị ẩn",
      CONTRACT_CREATED: "Hợp đồng mới",
      VIEW_REQUEST: "Yêu cầu xem phòng mới",
      ROOM_REPORTED: "Báo cáo phòng",
      ROOM_REPORT_HANDLED: "Xử lý báo cáo phòng",
      VIEW_REQUEST_ACCEPTED: "Yêu cầu xem phòng được chấp nhận"
    };
    return titles[type] || "Thông báo mới";
  };

  const formatNotificationMessage = (payload) => {
    switch (payload.type) {
      case "RENT_REQUEST_VIEW_ROOM":
      case "VIEW_REQUEST":
        return `Bạn có yêu cầu xem phòng mới từ ${payload.data?.renterName || "người thuê"}`;
      case "VIEW_REQUEST_RESPONSE":
        return payload.data?.status === "ACCEPTED"
          ? `Yêu cầu xem phòng đã được chấp nhận. Liên hệ Zalo: ${payload.data?.ownerZalo || "Chưa cập nhật"}`
          : `Yêu cầu xem phòng bị từ chối. Lý do: ${payload.data?.adminNote || "Không có lý do"}`;
      case "ROOM_REPORTED":
        return `Phòng "${payload.data?.roomTitle}" đã bị báo cáo với lý do: ${payload.data?.reason}`;
      case "ROOM_REPORT_HANDLED":
        return payload.data?.isViolation
          ? `Bài đăng của bạn đã bị xóa do vi phạm: ${payload.data?.adminNote}`
          : `Báo cáo bài đăng không vi phạm: ${payload.data?.adminNote}`;
      case "VIEW_REQUEST_ACCEPTED":
        return `Yêu cầu xem phòng của bạn đã được chấp nhận`;
      default:
        return payload.message || "Thông báo mới";
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const isDuplicate = prev.some(n =>
        n.type === notification.type &&
        n.data?.requestId === notification.data?.requestId
      );
      if (isDuplicate) return prev;

      setUnreadCount(count => count + 1);
      try {
        new Audio("/notification-sound.mp3").play();
      } catch {
        // Ignore
      }
      return [notification, ...prev];
    });
  };

  const sendNotification = async (recipientId, message, type = "INFO", data = null) => {
    try {
      if (!stompClient?.connected) {
        console.log("WebSocket not connected, queuing notification");
        if (pendingNotificationsRef.current.length < MAX_PENDING_NOTIFICATIONS) {
          pendingNotificationsRef.current.push({ recipientId, message, type, data });
        }
        throw new Error("WebSocket not connected");
      }

      const token = localStorage.getItem("authToken");
      const payload = {
        userId: recipientId,
        message,
        type,
        data: data || {},
        timestamp: new Date().toISOString()
      };

      stompClient.publish({
        destination: "/app/notifications",
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId,
          'X-CSRF-TOKEN': localStorage.getItem('csrfToken') || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  };

  const processPendingNotifications = async () => {
    if (!stompClient?.connected || pendingNotificationsRef.current.length === 0) return;

    const queue = [...pendingNotificationsRef.current];
    pendingNotificationsRef.current = [];

    for (const n of queue) {
      try {
        await sendNotification(n.recipientId, n.message, n.type, n.data);
      } catch (error) {
        console.error("Error sending queued notification:", error);
        if (pendingNotificationsRef.current.length < MAX_PENDING_NOTIFICATIONS) {
          pendingNotificationsRef.current.push(n);
        }
      }
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(count => Math.max(0, count - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    isConnected,
    connectionState,
    addNotification,
    markAsRead,
    markAllAsRead,
    sendNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
