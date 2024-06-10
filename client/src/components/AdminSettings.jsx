import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase-config';
import {
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import './Settings.css';


const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('mainInfo');
  const [userData, setUserData] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userDataFromFirestore = userDocSnapshot.data();
          setUserData(userDataFromFirestore);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div id='ClientSettings'>
    <div class="settings-heading">
      <h1>Settings</h1>
    </div>
      <ul>
        <li onClick={() => handleTabClick('mainInfo')}>Main Info</li>
        <li onClick={() => handleTabClick('terms-conditiona')}>Terms and Conditions</li>
      </ul>

      <div>
        {activeTab === 'mainInfo' && (
          <div>
            <h2>Main Info</h2>
            {userData && (
              <div>
                <p>First Name: {userData.first_name}</p>
                <p>Last Name: {userData.last_name}</p>
                <p>Email: {userData.email}</p>
                <p>Company: {userData.company}</p>
                <p>User Type: {userData.user_type}</p>

              </div>
            )}
          </div>
        )}

        {activeTab === 'terms-conditiona' && (
          <div>
          <h2>T&C's</h2>
          <div className="paragraph">
          
        <p> **Terms and Conditions for Booking App**
            **1. Introduction**
            These Terms and Conditions govern your use of the Booking App. By accessing and using the app, you agree to comply with these terms. If you do not agree with any part of these terms, you may not use the app.
            **2. Use of the App**
            2.1. You must be at least 18 years old to use this app.
            2.2. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device to prevent unauthorized use of your account.
            2.3. You agree not to use the app for any illegal or unauthorized purpose or to violate any laws in your jurisdiction.
            **3. Booking and Reservations**
            3.1. The app allows you to make bookings and reservations with third-party service providers. The terms and conditions of those service providers may also apply.
            3.2. Cancellations and refunds are subject to the policies of the service provider.
            **4. User Content**
            4.1. You retain ownership of the content you submit to the app, including reviews and feedback. By submitting content, you grant the app a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and display the content.
            4.2. You agree not to submit any content that is defamatory, illegal, or violates the rights of others.
            **5. Privacy**
            5.1. Your use of the app is subject to our Privacy Policy, which can be accessed on the app.
            **6. Termination**
            6.1. We may terminate or suspend your account and access to the app at our sole discretion, without notice, for any reason, including a breach of these terms.
            **7. Changes to Terms and Conditions**
            7.1. We reserve the right to modify these terms at any time. Your continued use of the app after changes are posted constitutes your acceptance of the modified terms.
            **8. Contact Us**
            8.1. If you have any questions or concerns about these terms, please contact us at [Your Contact Information].
            These are fictional terms for illustrative purposes only. Please consult with legal counsel to create the actual terms and conditions for your booking app, considering relevant laws and regulations.
        </p>
        </div>
        </div>
        )}
      </div>
    </div>
  );
  };

export default AdminSettings;

