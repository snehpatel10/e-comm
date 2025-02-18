import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const socket = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/notification');
                const data = await response.json();
                console.log(data)
                setNotifications(data);
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotifications();

        socket.current = io('http://localhost:5000');

        socket.current.on('orderCreated', (message) => {
            setNotifications((prevNotification) => [message, ...prevNotification]);
        });

        socket.current.on('notificationRead', (updatedNotification) => {
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === updatedNotification._id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        });

        socket.current.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        return () => {
            socket.current.disconnect();
            console.log('Disconnected from WebSocket server');
        };
    }, []);

    const handleCloseNotification = (index, notificationId) => {
        socket.current.emit('deleteNotification', notificationId);

        setNotifications((prevNotifications) =>
            prevNotifications.filter((_, i) => i !== index)
        );
    };

    const handleMarkAsRead = (notificationId) => {
        socket.current.emit('markNotificationAsRead', notificationId);  // Emit event to mark as read on the server
    };

    return (
        <div className="ml-[3rem] mt-[2rem] p-4 rounded-lg shadow-md bg-white dark:bg-[#121212]">
        <h1 className="text-xl font-bold uppercase mb-4 text-white">Notifications</h1>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 border border-gray-300 rounded-lg shadow-sm dark:border-gray-700 bg-gray-100 dark:bg-[#1a1a1a] relative ${
                  notification.isRead ? 'bg-gray-200 dark:bg-[#333]' : ''
                }`}
              >
                {/* Close Button */}
                <button
                  onClick={() => handleCloseNotification(index, notification._id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
      
                {/* Notification Content */}
                <div className="flex flex-col space-y-2 mb-8">
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">
                    {notification.username}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleString()}
                  </p>
                </div>
      
                {/* Mark as Read Button */}
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="absolute bottom-2 left-2 p-2 btn btn-primary btn-sm text-white rounded-full hover:bg-blue-600 focus:outline-none"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
    );
}

export default Notification;
