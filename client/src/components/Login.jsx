import { auth, db } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState} from "react";
import { Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';  // Import Firestore functions
import'./Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //sending user_id to booking component

    const handleLogin = async () => {
        // Basic validations
        if (!email || !email.includes('@')) {
            alert('Please provide a valid email.');
            return;
        }
        if (!password) {
            alert('Password is required.');
            return;
        }
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
           

            // Update the user's last signed-in date and time
            const sessionDocRef = doc(db, 'sessions', user.uid);
            await setDoc(sessionDocRef, {
                lastSignIn: new Date(),
            });
            //sending user_id to the booking component

            alert("Logged in successfully!");
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };
    
    return (
        
        <div className="login-container">
        <div className="form-box">
        <div className="logo-container">
          <img
            src="https://generation-sessions.s3.amazonaws.com/c8e8f48f376e078602d60c3565370f1f/img/logo-1@2x.png" // The URL of the image logo
            alt="Logo"
            className="logo"
          />
          </div>
            <div>
                <h1>Login</h1>
            </div>
            <div>
                <h4>Please enter your account details below:</h4>
            </div>
            <div>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                 <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
            <div>
            <p>Don't have an account? <Link to="/signup">SignUp</Link></p>
            </div>
        </div>
        </div>
        
    );
};

export default Login;