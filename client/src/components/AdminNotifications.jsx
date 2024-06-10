import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import './AdminNotifications.css'; // Import the CSS

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationsQuery = query(
        collection(db, `notifications/ADMIN/messageNotifications`),
        orderBy('timestamp', 'desc')
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);

      const notificationsData = notificationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(notificationsData);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Admin Notifications</h2>
      <ul className="notifications-list">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <div className="notification-text">Message From:</div>
            <div>{notification.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
  

};

export default AdminNotifications;

