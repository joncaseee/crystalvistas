import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative h-96">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-black opacity-10" />
      <div className="absolute inset-0 flex flex-col items-end mr-6 justify-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-1 text-right animate-fade-in ease-in duration-1000">
          Welcome to CrystalVistas
        </h1>
        <h3 className='ml-8'>Proudly Serving Colorado Springs!</h3>
        <Link 
          to="/get-quote" 
          className="mt-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-md text-white px-6 py-3 rounded-md shadow-md text-lg font-semibold hover:bg-opacity-30 transition duration-300 animate-fade-in ease-in delay-200"
        >
          Get Quote
        </Link>
      </div>
    </div>
  );
};

export default Hero;