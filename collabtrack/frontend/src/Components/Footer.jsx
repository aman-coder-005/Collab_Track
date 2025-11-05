import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} CollabTrack. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;