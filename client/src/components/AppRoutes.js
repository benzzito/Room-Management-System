import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminLayout from './AdminLayout';                        // Import the layout components
import ClientLayout from './ClientLayout';

import Login from './Login';                                  // Import login/signup routes
import SignUp from './SignUp';

import HomePage from './HomePage';                            // Import Client Routes
import BookVenue from './BookVenue';
import ClientManageBookings from './ClientManageBookings';
import Notifications from './notifications';
import Messages from './messages';
import Settings from './Settings';

import AdminDashboard from './AdminDashboard';               // Import Admin Routes
import AdminManageBookings from './AdminManageBookings';
import AdminMessages from './AdminMessages';
import AdminNotifications from './AdminNotifications';
import AdminSettings from './AdminSettings';
import AdminCreateUser from './AdminCreateUser';
import AdminEditUser from './AdminEditUser';
import AdminDeleteUser from './AdminDeleteUser';
import AdminCreateRoom from './AdminCreateRoom';
import AdminEditRoom from './AdminEditRoom';
import AdminDeleteRoom from './AdminDeleteRoom';

import { BookingProvider } from './BookingContext';//relevant to create bookings


const AppRoutes = () => {
    const { currentUser, userType, loading } = useAuth();
    console.log("currentUser:", currentUser);
    console.log("userType:", userType);

    if (loading) {
        return <div>Loading...</div>;
      }
  
    return (
        <div className="AppRoutes">
        <Router>
          <Routes>
            {/* login and signup routes */}
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={<SignUp />} />
    
            {/* Admin routes */}
            {currentUser && userType === 'Admin' && (
                <>
                <Route element={<AdminLayout />}>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/admin-manage-bookings" element={<AdminManageBookings />} />
                <Route path="/admin-notifications" element={<AdminNotifications />} />
                <Route path="/admin-messages" element={<AdminMessages />} />
                <Route path="/admin-settings" element={<AdminSettings />} />
                <Route path="/admin-create-user" element={<AdminCreateUser />} />
                <Route path="/admin-edit-user" element={<AdminEditUser />} />
                <Route path="/admin-delete-user" element={<AdminDeleteUser />} />
                <Route path="/admin-create-room" element={<AdminCreateRoom />} />
                <Route path="/admin-edit-room" element={<AdminEditRoom />} />
                <Route path="/admin-delete-room" element={<AdminDeleteRoom />} />
                </Route>
                </>
            )}
    
            {/* Tenant or Ad-Hoc routes */}
            {currentUser && (userType === 'Tenant' || userType === 'Ad-Hoc') && (
                <>
                <Route element={<ClientLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/book-venue" element={<BookingProvider> <BookVenue userType={userType} uid={currentUser.uid}/> </BookingProvider>} />
                <Route path="/manage-bookings" element={<ClientManageBookings uid={currentUser.uid}/>} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                </Route>
                </>
            )}
    
            {/* Redirect unauthenticated users */}
            {(!currentUser) && <Route path = "/" element={<Navigate to="/login" />} />}
          </Routes>
        </Router>
        </div>
      );
    };
    
    export default AppRoutes;