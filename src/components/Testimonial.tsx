import React from 'react';
import { Star } from 'lucide-react';

const Testimonial: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img 
              src="/inaction.jpg" 
              alt="Window cleaner in action" 
              className="rounded-lg shadow-md max-w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 md:pl-8 flex space flex-col justify-center space-y-8">
            <div className="bg-white rounded-lg mb-4 shadow-md p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="text-yellow-400 fill-current" size={24} />
                ))}
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                "Crystal Vistas transformed our home with their exceptional window cleaning service. The attention to detail and professionalism were outstanding!"
              </blockquote>
              <p className="text-gray-600 font-semibold">- Sarah J., Colorado Springs</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="text-yellow-400 fill-current" size={24} />
                ))}
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                "Jamie did an excellent job! My windows have never looked better."
              </blockquote>
              <p className="text-gray-600 font-semibold">- Mike T., Colorado Springs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;