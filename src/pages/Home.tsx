import React from 'react';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import Testimonial from '../components/Testimonial';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <Testimonial />
      <AboutSection />
    </div>
  );
};

export default Home;