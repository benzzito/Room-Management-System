import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase-config';
import './AdminMessages.css';

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender === 'Admin' ? 'sent' : 'received'}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
};

const AdminMessages = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerChats, setCustomerChats] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Add state for search input
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchCustomerChats = async () => {
      try {
        const customerChatsCollectionRef = collection(db, 'users');
        const customerChatsSnapshot = await getDocs(customerChatsCollectionRef);
        const chats = customerChatsSnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
        }));
        setCustomerChats(chats);
      } catch (error) {
        console.error('Error loading customer chats:', error);
      }
    };

    fetchCustomerChats();
  }, []);

  const handleCustomerSelect = async (customerId, email) => {
    setSelectedCustomerId(customerId);

    const sanitizedEmail = sanitizeForFirestore(email);

    // Update the subcollection name to be the sanitized customer's email
    const messagesCollectionRef = collection(db, `messages/${sanitizedEmail}/chat`);
    const messagesSnapshot = await getDocs(messagesCollectionRef);
    const messages = messagesSnapshot.docs.map((doc) => {
      const data = doc.data();
      // Convert Firestore timestamp to JavaScript Date object
      return {
        ...data,
        timestamp: data.timestamp.toDate(),
      };
    });

    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);

    setAdminMessages(messages);

    // Check if the chat subcollection exists, if not, create it
    const chatExists = messagesSnapshot.docs.length > 0;
    if (!chatExists) {
      try {
        await addDoc(messagesCollectionRef, {
          text: 'Chat started!',
          sender: 'Admin',
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }

    document.getElementById('chat-title').innerText = `Chat with User ${email}`;
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    if (!selectedCustomerId) {
      console.error('No selected customer.');
      return;
    }

    const customer = customerChats.find((customer) => customer.id === selectedCustomerId);
    const userEmail = customer.email;
    const sanitizedEmail = sanitizeForFirestore(userEmail);

    const messageData = {
      text: newMessage,
      sender: 'Admin',
      timestamp: serverTimestamp(),
    };

    const notificationData = {
      text: 'New message in chat',
      timestamp: serverTimestamp(),
    };

    try {
      // Update the subcollection name to be the sanitized customer's email
      const chatCollectionRef = collection(db, `messages/${sanitizedEmail}/chat`);
      const notificationCollectionRef = collection(
        db,
        `notifications/${sanitizedEmail}/messagenotifications`
      );

      // Add the message to the chat subcollection
      await addDoc(chatCollectionRef, messageData);

      // Check if the notifications subcollections exist, if not, create them
      const notificationDocRef = doc(db, `notifications/${sanitizedEmail}`);
      const notificationDocSnap = await getDoc(notificationDocRef);

      if (!notificationDocSnap.exists()) {
        await setDoc(notificationDocRef, {});

        // Add the notification to the messagenotifications subcollection
        await addDoc(notificationCollectionRef, notificationData);
      } else {
        // Add the notification to the messagenotifications subcollection
        await addDoc(notificationCollectionRef, notificationData);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message and notification:', error);
    }
  };

  const sanitizeForFirestore = (input) => {
    // Replace invalid characters with underscores
    return input.replace(/[#$[\]/]/g, '_');
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const clearSearch = () => {
    setSearchInput('');
  };

  // Filter customer chats based on search input
  const filteredCustomerChats = customerChats.filter((customer) =>
    customer.email.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="AdminMessages">
      <div className="chat-list customer-chat-list">
        <h2>Customer Chats</h2>
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button onClick={clearSearch}>Clear Search</button>
        <ul>
          {filteredCustomerChats.map((customer) => (
            <li
              key={customer.id}
              onClick={() => handleCustomerSelect(customer.id, customer.email)}
            >
              {`Chat with User ${customer.email}`}
            </li>
          ))}
        </ul>
      </div>
  
      <div className="chat-display">
        <h2 id="chat-title">Select a user to start a chat</h2>
        <MessageList messages={adminMessages} />
        <div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
  
  
  
  
};

export default AdminMessages;











