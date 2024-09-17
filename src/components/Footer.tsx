import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-6">Crystal Vistas</h3>
            <div className="flex items-center mb-4">
              <MapPin size={20} className="mr-3 text-blue-400" />
              <p>Colorado Springs, CO</p>
            </div>
            <div className="flex items-center mb-4 underline">
              <Mail size={20} className="mr-3 text-blue-400" />
              <a href="mailto:CrystalVistasCO@gmail.com" className="hover:text-blue-400 transition duration-300">
                CrystalVistasCO@gmail.com
              </a>
            </div>
            <div className="flex items-center underline">
              <Phone size={20} className="mr-3 text-blue-400" />
              <a href="tel:+9204614887" className="hover:text-blue-400 transition duration-300">
                (920) 461-4887
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 underline">
              <li><Link to="/" className="hover:text-blue-400 transition duration-300">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition duration-300">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition duration-300">Services</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition duration-300">Contact</Link></li>
              <li><Link to="/get-quote" className="hover:text-blue-400 transition duration-300">Get Quote</Link></li>
              <li><Link to="/employee-login" className="hover:text-blue-400 transition duration-300">Employee Portal</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end">
            <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
            <a 
              href="https://www.instagram.com/crystalvistasco?igsh=eXBsMGJtbmFoNWlm" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              <Instagram size={24} className="mr-3" />
              Follow on Instagram
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Crystal Vistas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;