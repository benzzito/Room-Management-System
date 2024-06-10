import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        console.log('Firebase UID:', user.uid); // TEST
        // Retrieve user_type from Firestore
        const userDocRef = doc(db, 'users', user.uid); // Create a reference to the user's document
        console.log('Firestore Document ID:', userDocRef.id);   //TEST

        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            setUserType(docSnapshot.data().user_type);
            console.log('User Document Snapshot:', docSnapshot);    //TEST
            console.log('User Document Data:', docSnapshot.data());     //TEST
          } else {
            setUserType('waitingUserType');
          }
        } catch (error) {
          console.error('Error fetching user_type:', error);
        } finally {
          setLoading(false); // Set loading to false when data retrieval is complete
          console.log('After fetching user_type data');     // TEST
        }
      } else {
        setUserType(null);  //TEST
        setLoading(false); // Set loading to false for unauthenticated users
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userType,
    loading, // Provide loading state in the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


