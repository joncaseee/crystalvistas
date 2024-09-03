import React from 'react';
import ServicesSection from '../components/ServicesSection';

const Services: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      
      <ServicesSection />
      <div className="mt-12 mb-8 mx-auto max-w-96">
        <h2 className="text-2xl font-bold mb-4">Why Choose Crystal Vistas?</h2>
        <ul className="list-disc list-inside text-gray-700 text-left ml-12">
          <li>Experienced and professional team</li>
          <li>Eco-friendly cleaning solutions</li>
          <li>Attention to detail</li>
          <li>Competitive pricing</li>
          <li>Flexible scheduling</li>
          <li>100% satisfaction guarantee</li>
        </ul>
      </div>
    </div>
  );
};

export default Services;