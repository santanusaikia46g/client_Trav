import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ height = 42, className = '', onClick }) => {
  return (
    <Link to="/" className={`logo-brand ${className}`} onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
      <svg
        height={height}
        viewBox="0 0 410 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      >
        {/* Orange Accent Swoosh under T */}
        <path
          d="M 20 68 C 15 84, 45 88, 68 64 C 48 76, 28 76, 20 68 Z"
          fill="#ff7700"
        />

        {/* Stylized Italic Dark Blue T */}
        <path
          d="M 28 24 C 40 20, 80 18, 105 18 C 103 26, 85 28, 66 28 L 54 66 C 50 72, 42 72, 46 62 L 58 28 L 38 28 C 28 28, 24 26, 28 24 Z"
          fill="#0046b8"
        />

        {/* Curved Cyan Airplane Trail Arc */}
        <path
          d="M 52 54 C 80 34, 150 18, 222 14"
          stroke="#0088ff"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Airplane Icon at the tip of the arc */}
        <g transform="translate(210, 2) rotate(-18) scale(0.9)">
          <path
            d="M 22 2 L 13 14 L 3 12 L 7 18 L 1 24 L 7 23 L 11 30 L 14 29 L 12 22 L 22 18 Z"
            fill="#0088ff"
          />
        </g>

        {/* "rav" in Dark Blue */}
        <text
          x="102"
          y="72"
          fontFamily="'Poppins', 'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="#0046b8"
          letterSpacing="-1"
        >
          rav
        </text>

        {/* "mitr" in Bright Sky Blue */}
        <text
          x="184"
          y="72"
          fontFamily="'Poppins', 'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="#0088ff"
          letterSpacing="-1"
        >
          mitr
        </text>

        {/* "aa" in Vibrant Orange */}
        <text
          x="312"
          y="72"
          fontFamily="'Poppins', 'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif"
          fontWeight="800"
          fontSize="52"
          fill="#ff7700"
          letterSpacing="-1"
        >
          aa
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
