import React from 'react';

const HeroBanner = ({ title, subtitle, image }) => {
  return (
    <div className="hero-banner flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-white text-opacity-90">{subtitle}</p>
      </div>
      {image && (
        <div className="hidden md:block">
          <img 
            src={image} 
            alt="Banner illustration" 
            className="h-44 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
