import React from 'react';
import AboutSection from '../components/AboutSection';

const About: React.FC = () => {
  return (
    <div className="container bg-white mx-auto p-4">
      <h1 className="text-3xl text-gray-800 font-bold mb-8 text-center">About the Owner</h1>
      <div className="mb-12">
        <p className="text-gray-700 mb-6">
          At CrystalVistas, we understand that a clear view can transform your space. Established in 2023, we are dedicated to providing exceptional window cleaning services to the Colorado Springs community. As a one-man operation, owner Jamie Dahlin ensures that every job is completed with precision and care.
        </p>
        <p className="text-gray-700 mb-6">
          Jamie Dahlin, the driving force behind CrystalVistas, is known for his hard work and meticulous attention to detail. With a deep commitment to delivering high-quality results, Jamie personally handles every project, ensuring your windows are spotless and your expectations are exceeded.
        </p>
        <p className="text-gray-700 mb-6">
          Whether you're looking for sparkling clean windows for your home or a polished appearance for your business, Crystal Vistas is here to enhance your view. We pride ourselves on our integrity, reliability, and superior service, and we look forward to helping you enjoy a clearer perspective.
        </p>
        <p className="text-gray-700 mb-6">
          Thank you for choosing CrystalVistas. We are excited to bring a touch of brilliance to your windows.
        </p>
      </div>
      <AboutSection />
    </div>
  );
};

export default About;