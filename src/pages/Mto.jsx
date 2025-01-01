import React from 'react';

function Mto() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li>Overview</li>
          <li>Reports</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <h1>MTO</h1>
        </div>
        <div className="content">
          <h2>Overview Section</h2>
          <p>This is where you can display an overview of key metrics and information.</p>

          {/* You can add more sections or components here */}
        </div>
      </div>
    </div>
  );
}

export default Mto;
