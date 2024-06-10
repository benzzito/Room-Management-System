import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, getFirestore } from 'firebase/firestore';
import { db, auth } from '../config/firebase-config';
import './notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        console.error('User not authenticated.');
        return;
      }

      const userEmail = currentUser.email;
      const sanitizedEmail = sanitizeForFirestore(userEmail);

      const firestore = getFirestore();
      const notificationsQuery = query(collection(firestore, `notifications/${sanitizedEmail}/messagenotifications`), orderBy('timestamp', 'desc'));

      const notificationsSnapshot = await getDocs(notificationsQuery);

      const notificationsData = notificationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setNotifications(notificationsData);
    };

    fetchNotifications();
  }, [currentUser]);

  const sanitizeForFirestore = (input) => {
    // Replace invalid characters with underscores
    return input.replace(/[#$[\]/]/g, '_');
  };

  return (
    <div id='Notifications'>
      <h2>Message Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;



