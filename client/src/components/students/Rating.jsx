import React, { useEffect, useState } from "react";

function Rating({ initialRating = 0, onRate }) {
  const [rating, setRating] = useState(initialRating);

  const handleRating = (value) => {
    setRating(value);
    onRate?.(value);
  };

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        return (
          <span
            key={index}
            onClick={() => handleRating(starValue)}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors duration-200
              ${starValue <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default Rating;
