import React from 'react';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>       {/* This is temporary styling until we add CSS to our pages */}
        <Sidebar />
        <main style={{ marginLeft: '275px' }}>
            <Outlet />
        </main>
    </div>
  );
};

export default ClientLayout;

{/* style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25vh' }} */}

{/*style={{ marginLeft: '250px' }}*/}