import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, X } from 'lucide-react';
import AverageRating from './AverageRating';

interface Review {
  id: string;
  rating: number;
  name: string;
  message: string;
  createdAt: Timestamp;
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (isOpen) {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reviewsData: Review[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          reviewsData.push({
            id: doc.id,
            rating: data.rating,
            name: data.name || '',
            message: data.message || '',
            createdAt: data.createdAt as Timestamp,
          });
        });
        setReviews(reviewsData);
      });

      return () => unsubscribe();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="pointer-events-none">
          <AverageRating />
        </div>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto mt-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                {review.name && <span className="font-bold mr-2">{review.name}</span>}
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={`${
                      star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {review.createdAt.toDate().toLocaleDateString()}
                </span>
              </div>
              {review.message && <p className="text-gray-700">{review.message}</p>}
              {!review.message && review.rating >= 4 && (
                <p className="text-gray-500 italic">Submitted on Google</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;