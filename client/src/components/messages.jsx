import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase-config';
import './messages.css';

const CustomerMessages = () => {
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      console.error('User is not authenticated.');
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);

    (async () => {
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('User data retrieved:', userData);

          const email = userData.email;
          setUserEmail(email);
          console.log('User email:', email);

          const sanitizedEmail = sanitizeForFirestore(email);

          const chatCollectionRef = collection(db, `messages/${sanitizedEmail}/chat`);
          const chatSnapshot = await getDocs(chatCollectionRef);
          const chatData = chatSnapshot.docs.map((doc) => {
            const data = doc.data();
            // Convert Firestore timestamp to JavaScript Date object
            return {
              ...data,
              timestamp: data.timestamp.toDate(),
            };
          });
          setMessages(chatData);

          // Sort messages by timestamp
          chatData.sort((a, b) => a.timestamp - b.timestamp);
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    })();
  }, []);

  const handleSendMessage = async () => {
    if (!userEmail) {
      console.error('User email not available.');
      return;
    }

    if (newMessage.trim() === '') {
      console.error('Message is empty.');
      return;
    }

    try {
      const sanitizedEmail = sanitizeForFirestore(userEmail);
      const messageData = {
        text: newMessage,
        sender: 'customer',
        timestamp: serverTimestamp(),
      };

      const userChatCollectionRef = collection(db, `messages/${sanitizedEmail}/chat`);
      await addDoc(userChatCollectionRef, messageData);

      // Create notification with user's email and message content
      const notificationData = {
        text: `Message from ${userEmail}: ${newMessage}`,
        timestamp: serverTimestamp(),
      };

      // Adjusted document reference to notifications/ADMIN/messageNotifications
      const notificationCollectionRef = collection(db, `notifications/ADMIN/messageNotifications`);
      await addDoc(notificationCollectionRef, notificationData);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message and notification:', error);
    }
  };

  const sanitizeForFirestore = (input) => {
    if (!input) return '';
    return input.replace(/[#$[\]/]/g, '_').replace(/\/+/g, '_');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'customer' ? 'customer-message' : 'admin-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerMessages;













