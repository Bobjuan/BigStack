import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Product', href: '/product' },
  { name: 'Resources', href: '/resources' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Customers', href: '/customers' },
  { name: 'Contact', href: '/contact' },
];

const Footer = () => (
  <footer className="w-full border-t border-white/10 bg-[#0F1115]/80 backdrop-blur-xl py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 mb-4 md:mb-0 text-base">
          © 2025 BigStake. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-base font-medium text-gray-400 hover:text-white transition-colors duration-150"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 