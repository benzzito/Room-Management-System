import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Importing the signOut function from Firebase
import { auth } from '../config/firebase-config' // Import your Firebase auth object
import'./sidebar.css';
import 'boxicons/css/boxicons.min.css';


const Sidebar = () => {           
  //const navigate = useNavigate(); //TEST
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcons, setShowIcons] = useState(true);


  const handleToggleClick = () => {
    setSidebarOpen(!sidebarOpen);
    setShowIcons(!showIcons);
  };

  //const handleSearchClick = () => {
  //  setSidebarOpen(false);
  //};

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logging out using Firebase's signOut function
      //navigate('/login'); //TEST
      console.log("Logged out successfully!");
      alert('Logged Out Successfully!');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  return (
    <nav className={sidebarOpen ? 'sidebar' : 'sidebar close'}>
     <header>
  <div className="text logo-text">
    <span className="name">WCH SOLUTIONS</span>
  </div>
  <i className='bx bx-chevron-right toggle' onClick={handleToggleClick}></i>
</header>
    
      <div className="menu-bar">
        <div className="menu">
          <ul className={`menu-links ${showIcons ? '' : 'hide-icons'}`}>
            <li>
              <Link to="/settings" className="profile-logout">
                <i className="bx bx-user"></i>
                <span className={showIcons ? '' : 'hide-text'}>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="bx bx-home"></i>
                <span className={showIcons ? '' : 'hide-text'}>HOMEPAGE</span>
              </Link>
            </li>
            <li>
              <Link to="/book-venue">
                <i className="bx bx-book-open"></i>
                <span className={showIcons ? '' : 'hide-text'}>BOOK VENUE</span>
              </Link>
            </li>
            <li>
              <Link to="/manage-bookings">
                <i className="bx bx-list-ul"></i>
                <span className={showIcons ? '' : 'hide-text'}>MANAGE BOOKINGS</span>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <i className="bx bx-bell"></i>
                <span className={showIcons ? '' : 'hide-text'}>NOTIFICATIONS</span>
              </Link>
            </li>
            <li>
              <Link to="/messages">
                <i className="bx bx-message-detail"></i>
                <span className={showIcons ? '' : 'hide-text'}>MESSAGES</span>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <i className="bx bx-cog"></i>
                <span className={showIcons ? '' : 'hide-text'}>SETTINGS</span>
              </Link>
            </li>
            <li>
               <Link to="/login" onClick={handleLogout} className="menu-link logout-button">
                  <i className="bx bx-log-out"></i>
                  <span className={showIcons ? '' : 'hide-text'}>Logout</span>
                  </Link>
                    </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;