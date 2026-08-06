import React from 'react';

const Logo = ({ className = '', style = {} }) => {
  return (
    <span className={`logo ${className}`.trim()} style={style} aria-label="Travmitraa">
      <span className="trav">Trav</span>
      <span className="mitraa">mitraa</span>
    </span>
  );
};

export default Logo;
