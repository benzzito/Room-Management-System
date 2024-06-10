import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; 
import { auth } from '../config/firebase-config' 
import styles from './sidebar.module.css'; 

const AdminSidebar = () => {
  //const navigate = useNavigate(); //TEST
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchClick = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      //navigate('/login'); //TEST
      console.log("Logged out successfully!");
      alert('Logged Out Successfully!');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <nav className={sidebarOpen ? styles.sidebar : `${styles.sidebar} ${styles.close}`}>
      <header>
        <div className="text logo-text">
          <span className="name">WCH SOLUTIONS</span>
        </div>
        <i className='bx bx-chevron-right toggle' onClick={handleToggleClick}></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <div className='Profile_Content'>
            <a href="/AdminSettings">Profile</a>
          </div>
          <ul className="menu-links">
            <li><Link to="/">DASHBOARD</Link></li>       {/* Note: These links are not complete (Need to distinguish user type first in app.js then add routes*/}
            <li><Link to="/admin-manage-bookings">MANAGE BOOKINGS</Link></li>
            <li><Link to="/admin-notifications">NOTIFICATIONS</Link></li>
            <li><Link to="/admin-messages">MESSAGES</Link></li>
            <li><Link to="/admin-settings">SETTINGS</Link></li>
          </ul> 
        </div>

        <div className="bottom-content">
        <Link to = "/login" onClick={handleLogout}>Logout</Link> {/* Attach the handleLogout function to the logout link */}
    </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;