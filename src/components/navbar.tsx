import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600"><span className='font-light'>Crystal</span><span className='font-medium'>Vistas</span></Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition duration-300">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition duration-300">About Us</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-600 transition duration-300">Services</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300">Contact</Link>
            <Link to="/get-quote" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">Get Quote</Link>
          </div>
          <button className="md:hidden bg-slate-100 text-gray-600" onClick={toggleMenu}>
            <motion.div
              animate={isOpen ? "open" : "closed"}
              variants={{
                closed: { rotate: 0 },
                open: { rotate: 90 }
              }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col items-center py-4 space-y-2">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition duration-300" onClick={toggleMenu}>Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition duration-300" onClick={toggleMenu}>About Us</Link>
              <Link to="/services" className="text-gray-600 hover:text-blue-600 transition duration-300" onClick={toggleMenu}>Services</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300" onClick={toggleMenu}>Contact</Link>
              <Link to="/get-quote" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300" onClick={toggleMenu}>Get Quote</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default NavBar