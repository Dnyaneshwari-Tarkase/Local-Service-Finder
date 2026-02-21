import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Local Service Finder – Neighborhood Helper App. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="hover:text-blue-400 text-sm">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 text-sm">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 text-sm">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
