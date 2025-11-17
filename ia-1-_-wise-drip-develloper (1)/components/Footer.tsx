import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';
import TwitterIcon from './icons/TwitterIcon';
import FacebookIcon from './icons/FacebookIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-text-light border-t border-brand-secondary">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <p className="text-brand-text-dark/60 text-sm mb-4 md:mb-0">
          © 2025 WISE DRIP. Tous droits réservés.
        </p>
        <nav className="flex space-x-6 my-4 md:my-0">
            {['Fonctionnalités', 'Notre Équipe', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-sm text-brand-text-dark/70 hover:text-brand-text-dark transition-colors">{item}</a>
            ))}
        </nav>
        <div className="flex space-x-6">
          <a href="#" aria-label="LinkedIn" className="text-brand-text-dark/50 hover:text-brand-primary transform hover:scale-110 transition-all duration-300">
            <LinkedInIcon />
          </a>
          <a href="#" aria-label="Twitter" className="text-brand-text-dark/50 hover:text-brand-primary transform hover:scale-110 transition-all duration-300">
            <TwitterIcon />
          </a>
          <a href="#" aria-label="Facebook" className="text-brand-text-dark/50 hover:text-brand-primary transform hover:scale-110 transition-all duration-300">
            <FacebookIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;