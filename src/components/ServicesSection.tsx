import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Building2 } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, subtitle, description, icon }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <h4 className="text-lg font-semibold mb-4 text-gray-600">{subtitle}</h4>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-gray-800 font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {isVisible && (
            <>
              <ServiceCard
                title="Residential Window Cleaning"
                subtitle="Sparkling Clean Windows for Your Home"
                description="Enhance the beauty of your home with our thorough residential window cleaning service. We use high-quality, eco-friendly products to remove dirt, grime, and streaks from your windows, ensuring a crystal-clear finish. Our experienced team is dedicated to providing meticulous service, leaving your windows spotless and your home looking its best."
                icon={<Home size={48} />}
              />
              <ServiceCard
                title="Commercial Window Cleaning"
                subtitle="Professional Solutions for Your Business"
                description="Make a great impression with pristine windows at your commercial property. Our team specializes in cleaning windows of all sizes and heights, from storefronts to office buildings. We work around your schedule to minimize disruption, using advanced techniques and equipment to deliver a polished and professional appearance for your business."
                icon={<Building2 size={48} />}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;