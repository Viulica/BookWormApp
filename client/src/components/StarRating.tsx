import React, { useState } from 'react';
import '../styles/StarRating.css';

interface StarRatingProps {
   rating: number;
   onRatingChange?: (selectedRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
   const [hoveredRating, setHoveredRating] = useState<number | null>(null);

   const handleStarClick = (selectedRating: number) => {
      if (onRatingChange) {
         onRatingChange(selectedRating);
      }
   };

   return (
      <span>
         {[1, 2, 3, 4, 5].map((star) => (
            <span
               key={star}
               className={`star ${rating >= star ? 'filled' : ''} ${hoveredRating !== null && hoveredRating >= star ? 'hovered' : ''
                  }`}
               onClick={() => handleStarClick(star)}
               onMouseEnter={() => setHoveredRating(star)}
               onMouseLeave={() => setHoveredRating(null)}
            >
               &#9733;
            </span>
         ))}
      </span>
   );
};

export default StarRating;
