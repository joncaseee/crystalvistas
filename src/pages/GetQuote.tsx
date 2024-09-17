import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const GetQuote: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    if (form.current) {
      try {
        // Send email
        const emailResult = await emailjs.sendForm(
          'service_e76nl4k',
          'template_vv10o3k',
          form.current,
          'dbyeQyaM7JBfpZP36'
        );

        console.log('Email sent successfully:', emailResult.text);

        // Store data in Firestore
        const formData = new FormData(form.current);
        const quoteData = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phoneNumber: formData.get('phoneNumber'),
          serviceType: formData.get('serviceType'),
          message: formData.get('message'),
          timestamp: new Date()
        };

        const docRef = await addDoc(collection(db, 'quoteRequests'), quoteData);
        console.log('Document written with ID: ', docRef.id);

        setSubmitMessage('Quote request submitted successfully. Our team will contact you within 24 hours to provide a free quote. A confirmation email has been sent to your email address.');
        form.current.reset();
      } catch (error) {
        console.error('Error:', error);
        setSubmitMessage('Failed to submit quote request. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Get a Free Quote</h1>
      <form ref={form} onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="firstName" className="block  font-bold mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-3 py-2 bg-slate-200 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block  font-bold mb-2">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full px-3 py-2 bg-slate-200 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block  font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 bg-slate-200 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block  font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            className="w-full px-3 py-2 bg-slate-200 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="serviceType" className="block  font-bold mb-2">Service Type</label>
          <select
            id="serviceType"
            name="serviceType"
            required
            className="w-full h-10 px-3 py-2 bg-slate-200 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a service</option>
            <option value="residential">Residential Window Cleaning</option>
            <option value="commercial">Commercial Window Cleaning</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block  font-bold mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full px-3 py-2 bg-slate-200 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
          </button>
        </div>
        {submitMessage && (
          <div className={`text-center ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default GetQuote;