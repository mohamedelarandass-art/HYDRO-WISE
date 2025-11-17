import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM21.921 17.653C21.84 17.711 21.742 17.75 21.64 17.763L18.441 18.175C18.337 18.188 18.243 18.163 18.169 18.103L15.93 16.4C15.823 16.315 15.772 16.176 15.801 16.042L16.48 13.24C16.501 13.149 16.559 13.069 16.64 13.021C16.721 12.973 16.818 12.959 16.911 12.984L20.111 13.803C20.215 13.829 20.306 13.896 20.361 13.987L22.106 16.621C22.185 16.745 22.173 16.907 22.08 17.014L21.921 17.21V17.653Z" className="fill-brand-primary"/>
            <path d="M22.08 17.014L21.921 17.21C21.942 17.228 21.96 17.249 21.975 17.271L22.08 17.014Z" className="fill-brand-primary"/>
            <path d="M21.921 17.653L21.91 17.21L22.08 17.014C22.032 17.021 21.982 17.032 21.933 17.047L16.079 18.848C15.526 19.034 14.931 18.767 14.745 18.214L13.715 15.352L10.36 21.168C10.02 21.737 10.329 22.484 10.978 22.753L11.59 23.013C12.239 23.282 12.985 22.972 13.246 22.324L16.082 16.41L18.169 18.103C18.243 18.163 18.337 18.188 18.441 18.175L21.64 17.763C21.742 17.75 21.84 17.711 21.921 17.653Z" className="fill-brand-primary"/>
        </svg>
        <span className="text-2xl font-bold text-brand-text-dark">WISE DRIP</span>
    </div>
);

const NavLinks = ({ className }: { className?: string }) => (
    <nav className={`space-x-8 ${className}`}>
        {['Fonctionnalités', 'Notre Approche', 'Notre Équipe', 'Contact'].map((item) => (
            <a key={item} href="#" className="text-brand-text-dark/70 hover:text-brand-text-dark transition-colors">{item}</a>
        ))}
    </nav>
);

interface HeaderProps {
  onNavigate: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-brand-text-light/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Logo />
                <div className="hidden md:flex items-center space-x-8">
                    <NavLinks />
                    <div className="flex items-center space-x-4 border-l border-brand-secondary pl-8">
                        <ThemeSwitcher />
                         <button className="font-semibold text-brand-text-dark/80 hover:text-brand-text-dark transition-colors">
                            Connexion
                        </button>
                        <button onClick={onNavigate} className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-all">
                            Demander une Démo
                        </button>
                    </div>
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden px-6 pb-4">
                    <nav className="flex flex-col space-y-4">
                        {['Fonctionnalités', 'Notre Approche', 'Notre Équipe', 'Contact'].map((item) => (
                            <a key={item} href="#" className="text-brand-text-dark/70 hover:text-brand-text-dark transition-colors">{item}</a>
                        ))}
                    </nav>
                    <div className="flex flex-col space-y-4 mt-6 pt-4 border-t border-brand-secondary">
                         <div className="mx-auto"><ThemeSwitcher /></div>
                        <button className="font-semibold text-brand-text-dark/80 hover:text-brand-text-dark transition-colors py-2">
                            Connexion
                        </button>
                        <button onClick={onNavigate} className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-all">
                            Demander une Démo
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
