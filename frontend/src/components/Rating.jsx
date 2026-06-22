import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = '#00f2fe' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={color}
          stroke={color}
          style={{ marginRight: '2px' }}
        />
      );
    } else if (value >= i - 0.5) {
      stars.push(
        <StarHalf
          key={i}
          size={16}
          fill={color}
          stroke={color}
          style={{ marginRight: '2px' }}
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          size={16}
          fill="none"
          stroke={color}
          style={{ marginRight: '2px', opacity: 0.4 }}
        />
      );
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex' }}>{stars}</div>
      {text && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
