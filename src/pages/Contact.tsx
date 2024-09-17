import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="flex justify-center mb-12">
        <Link 
          to="/get-quote" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get a Free Quote
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ContactCard
          icon={<Mail size={48} />}
          title="Email"
          content="CrystalVistasCO@gmail.com"
          link="mailto:CrystalVistasCO@gmail.com"
        />
        <ContactCard
          icon={<Phone size={48} />}
          title="Phone"
          content="(920) 461-4887"
          link="tel:+9204614887"
        />
        <ContactCard
          icon={<MapPin size={48} />}
          title="Location"
          content="Colorado Springs, CO"
          link="https://www.google.com/maps/place/Colorado+Springs,+CO/"
        />
      </div>
    </div>
  );
};

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  link: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, content, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <a 
        href={link} 
        className="text-gray-700 hover:text-blue-600 transition duration-300"
        target={title === "Location" ? "_blank" : undefined}
        rel={title === "Location" ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    </div>
  );
};

export default Contact;