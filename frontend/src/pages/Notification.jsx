import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Loader from '../components/Loader';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCountState] = useState(0);
  const [closingIndex, setClosingIndex] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://e-comm-jpql.onrender.com/api/notification');
        const data = await response.json();
        setLoading(false);
        setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        const unreadNotifications = data.filter(notification => !notification.isRead);
        setUnreadCountState(unreadNotifications.length);

        localStorage.setItem('unreadCount', unreadNotifications.length);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    socket.current = io('https://e-comm-jpql.onrender.com');

    socket.current.on('orderCreated', (message) => {
      setNotifications((prevNotifications) => [message, ...prevNotifications]);

      if (!message.isRead) {
        setUnreadCountState((prevCount) => prevCount + 1);
        localStorage.setItem('unreadCount', unreadCount + 1);
      }
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
    setClosingIndex(index);
    socket.current.emit('deleteNotification', notificationId);

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    }, 300); // Wait for the animation to finish before removing
  };

  const handleMarkAsRead = (notificationId) => {
    socket.current.emit('markNotificationAsRead', notificationId);
  };

  return (
    <div className="ml-[4rem] mr-[2rem] mt-[4rem] rounded-lg shadow-md bg-white dark:bg-[#121212]">
      <h1 className="text-2xl mb-4 text-white">Notifications</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification._id}
                className={`p-4 border rounded-lg shadow-sm transition-all duration-300 ease-in-out transform ${
                  notification.isRead
                    ? 'bg-gray-200 dark:bg-[#333]'
                    : 'bg-gray-100 dark:bg-[#1a1a1a]'
                } ${closingIndex === index ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} relative`}
              >
                <button
                  onClick={() => handleCloseNotification(index, notification._id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg hover:bg-black focus:outline-none transition-all duration-300"
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

                <div className="flex flex-col space-y-2 mb-8">
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">
                    {notification.username}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="absolute bottom-2 left-2 p-2 btn btn-primary btn-sm text-white rounded-full hover:bg-black focus:outline-none transition-all duration-300"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;
