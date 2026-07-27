import React from 'react';

const Spinner = ({ fullPage = false }) => {
  return (
    <div
      className="spinner-container"
      style={fullPage ? { minHeight: 'calc(100vh - var(--nav-height))' } : {}}
    >
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
