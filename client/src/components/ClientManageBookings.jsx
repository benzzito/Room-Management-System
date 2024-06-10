import React from 'react';
import ManageBookings from './ManageBookings';

function ClientManageBookings({uid}) {

  return (
    <div>
      <ManageBookings userId={uid} />
      {/* Optionally handle cases where userId is null */}
    </div>
  );
}

export default ClientManageBookings;
