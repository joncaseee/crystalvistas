import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const AboutSection: React.FC = () => {
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
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.div
              className="text-blue-600 mb-4 flex justify-center md:justify-start"
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Info size={64} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 text-center md:text-left">About CrystalVistas</h2>
            <p className="text-gray-700 text-center md:text-left">
              At CrystalVistas, we're passionate about delivering crystal-clear results for your windows. With years of experience and a dedication to customer satisfaction, we've become the go-to window cleaning service for homes and businesses alike.
            </p>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <motion.ul
              className="space-y-4"
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
            >
              {[
                "Professional and friendly staff",
                "Eco-friendly cleaning solutions",
                "Attention to detail on every job",
                "Flexible scheduling to meet your needs",
                "Fully insured and bonded service",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-gray-700"
                  variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: -50 },
                  }}
                >
                  <span className="text-blue-600 mr-2">✓</span> {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;