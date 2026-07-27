import React from 'react';

const SkeletonCard = ({ count = 3 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="card" style={{ border: '1px solid var(--border)' }}>
            <div className="skeleton skeleton-rect"></div>
            <div style={{ padding: '24px' }}>
              <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text" style={{ height: '32px' }}></div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '1px solid var(--border)'
                }}
              >
                <div className="skeleton skeleton-text" style={{ width: '30%', height: '24px', marginBottom: 0 }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%', height: '36px', marginBottom: 0 }}></div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default SkeletonCard;
