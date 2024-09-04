import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Star } from 'lucide-react';

interface AverageRatingProps {
  onClick?: () => void;
}

const AverageRating: React.FC<AverageRatingProps> = ({ onClick }) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    const fetchAverageRating = async () => {
      const q = query(collection(db, 'reviews'));
      const querySnapshot = await getDocs(q);
      let sum = 0;
      let count = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rating) {
          sum += data.rating;
          count++;
        }
      });
      setAverageRating(count > 0 ? sum / count : null);
      setTotalReviews(count);
    };

    fetchAverageRating();
  }, []);

  if (averageRating === null) {
    return null;
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold mb-2 text-gray-800">Average Rating</h2>
      <div className="flex items-center">
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`${
                star <= Math.round(averageRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
        <span className="text-sm text-gray-600 ml-2">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    </div>
  );
};

export default AverageRating;