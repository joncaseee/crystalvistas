import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';

const Reviews: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showFeedbackBox, setShowFeedbackBox] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [showGoogleButton, setShowGoogleButton] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubmitMessage('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [submitMessage]);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    setShowFeedbackBox(selectedRating <= 3);
    setShowGoogleButton(false);
    if (selectedRating > 3) {
      setName('');
      setMessage('');
    }
  };

  const sendEmailNotification = async (reviewData: any) => {
    try {
      await emailjs.send(
        'service_e76nl4k',
        'template_zon9yhx',
        {
          rating: reviewData.rating,
          name: reviewData.name || 'Anonymous',
          message: reviewData.message || 'Submitted on Google or Left Blank',
          date: new Date().toLocaleString(),
        },
        'dbyeQyaM7JBfpZP36'
      );
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setSubmitMessage('Please select a star rating before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        rating,
        name: rating <= 3 ? (name || 'Anonymous') : '',
        message: rating <= 3 ? message : '',
        createdAt: new Date(),
      };

      // Save review data to Firestore
      await addDoc(collection(db, 'reviews'), reviewData);

      // Send email notification
      await sendEmailNotification(reviewData);

      if (rating <= 3) {
        setSubmitMessage('Thank you for your feedback. We appreciate your input and will use it to improve our services.');
        // Reset form for 1-3 star ratings
        setRating(0);
        setName('');
        setMessage('');
        setShowFeedbackBox(false);
      } else {
        setSubmitMessage('Thank you for your positive review! Please click the button below to submit your review on Google.');
        setShowGoogleButton(true);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitMessage('An error occurred while submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleReview = () => {
    window.open('https://g.page/r/CQqDzwR7TWBFEBM/review', '_blank', 'noopener,noreferrer');
    // Reset form after opening Google review page
    setRating(0);
    setShowGoogleButton(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Rate Our Service</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <p className="block text-gray-700 text-sm font-bold mb-2">Your Rating:</p>
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={40}
                onClick={() => handleStarClick(star)}
                className={`cursor-pointer transition-colors duration-200 ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {showFeedbackBox && (
          <>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="feedback" className="block text-gray-700 text-sm font-bold mb-2">
                How can we improve our service?
              </label>
              <textarea
                id="feedback"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
          </>
        )}

        <div className="flex items-center justify-center">
          {!showGoogleButton && (
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                rating === 0 || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : rating <= 3 ? 'Submit Feedback' : 'Submit Review'}
            </button>
          )}
          {showGoogleButton && (
            <button
              type="button"
              onClick={handleGoogleReview}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit on Google
            </button>
          )}
        </div>

        {submitMessage && (
          <div className={`mt-4 text-center ${submitMessage.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Reviews;