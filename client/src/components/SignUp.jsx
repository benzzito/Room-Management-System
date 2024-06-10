import { auth, db } from "../config/firebase-config";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link } from 'react-router-dom';
import'./SignUp.css';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [userType, setUserType] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateInputs = () => {
        console.log("State values:", firstName, lastName, email, company, userType, password);      //TEST
        if (!firstName || !lastName || !email || !company || !userType || !password) {
            alert('All fields are required!');
            return false;
        }
        if (!email.includes('@')) {
            alert('Please provide a valid email!');
            return false;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return false;
        }
        return true;
    };

    const signUp = async () => {
        console.log("State values before signup:", firstName, lastName, email, company, userType, password);        //TEST
        if (!validateInputs()) {
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Storing additional info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                first_name: firstName,
                last_name: lastName,
                email: email,
                company: company,
                user_type: userType,
                created_at: new Date(),
                uid: user.uid
            });

            await signOut(auth);        //TEST

            alert("Account created and data stored successfully!");
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

        return (
            <div className="page-container">
                <div className="container">
                    <div className="logo-container">
                        <img src="https://generation-sessions.s3.amazonaws.com/c8e8f48f376e078602d60c3565370f1f/img/logo-1@2x.png" alt="Logo" className="logo" />
                    </div>
                    <div>
                        <h1>Sign Up</h1>
                    </div>
                    <div>
                        <h4>Please enter your details below to sign up for a new account:</h4>
                    </div>
                    <div>
                    <input className="input-field" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input className="input-field" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input-field" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                    <select className="input-field" value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="" disabled hidden>Select Role</option>
                    <option value="Ad-Hoc">Ad-Hoc</option>
                    <option value="Tenant">Tenant</option>
                    </select>
                    <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="input-field" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <button onClick={signUp}>SignUp</button>
                    </div>
                    <div>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        );
    };
    
    export default SignUp;