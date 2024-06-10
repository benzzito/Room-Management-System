import {useState} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCreateUser.css';

const AdminCreateUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const roles = ['Admin', 'Ad-Hoc', 'Tenant'];          //Roles to be used in create user dropdown menu

  const handleCreateUser = async () => {
    try {
      
      const adminUser = auth.currentUser;;  //Saving the admins current login credentials

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {            // Add user details to Firestore "users" collection
        first_name: firstName,
        last_name: lastName,
        email: email,
        company: company,
        user_type: selectedRole,
        created_at: new Date(),
        uid: user.uid
      });

      alert("Account created and data stored successfully!");

      setFirstName('');                 // Refresh the form after successful creation
      setLastName('');
      setEmail('');
      setPassword('');
      setCompany('');
      setSelectedRole('');

      if (adminUser) {                                                     //reauthenticating the admin after creating new user (prevents new user being logged in immediately)
        await signInWithEmailAndPassword(auth, adminUser.email, password);
      }

    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className='AdminCreateUser'>
          <h1>Create User</h1>
        
            <ul>
            <li><input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></li>
            <li><input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} /></li>
            <li><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></li>            
            <li><input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} /></li>

            <li><select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
             <option value="">Select Role</option>
             {roles.map((role) => (
             <option key={role} value={role}>{role}</option>
            ))}
            </select></li>

            <li><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></li>

            <li><button onClick={handleCreateUser}>Create User</button></li>
            </ul>

            <Link to="/">Back to Dashboard</Link>
   </div>
  );
};

export default AdminCreateUser;
