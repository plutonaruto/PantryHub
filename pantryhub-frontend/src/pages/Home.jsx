import React from 'react';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import HeroBanner from '../components/layout/HeroBanner';

const Home = () => {
  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-8">
        <HeroBanner 
          title="Welcome to PantryHub"
          subtitle="A Recipe for Responsibility"
          image="null" //replace later with proper image
        />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Marketplace</h3>
            <p className="text-gray-600 mb-4">Share and claim items from your community pantry.</p>
            <a href="/marketplace" className="text-primary hover:text-primary-dark font-medium">
              Visit Marketplace →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Inventory</h3>
            <p className="text-gray-600 mb-4">Track and manage your pantry items efficiently.</p>
            <a href="/inventory" className="text-primary hover:text-primary-dark font-medium">
              Check Inventory →
            </a>
          </div>
          
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Home;