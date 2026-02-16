import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal text-brutalist font-sans selection:bg-industrial selection:text-white">
      <Navbar />
      <main className="pt-[73px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;