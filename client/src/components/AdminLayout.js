import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center'}}>           {/* This is temporary styling until we add CSS to our pages */}
        <AdminSidebar />
        <main style={{ marginLeft: '275px' }}>                            
            <Outlet />
        </main>
    </div>
  );
};

export default AdminLayout;


{/* style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '45vh' }} */}

{/* style={{ marginLeft: '250px' }} */}