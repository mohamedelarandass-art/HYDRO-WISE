import React, { useContext } from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

interface HeroProps {
  onNavigate: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("Hero must be used within a ThemeProvider");
  }

  const { currentTheme } = themeContext;

  return (
    <section 
      className="relative bg-cover bg-center pt-24 pb-32 md:pt-32 md:pb-40 text-white overflow-hidden transition-all duration-500"
      style={{ backgroundImage: `url(${currentTheme.image})` }}
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-full text-center">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              WISE DRIP : Votre Co-pilote pour une Fertigation de Précision.
            </h1>
            <p className="text-lg md:text-xl text-brand-text-light/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Arrêtez de deviner. Notre plateforme transforme vos analyses (eau, drainage) et vos objectifs de culture en un plan de nutrition optimal. La puissance de la data science appliquée à l'agronomie, enfin accessible.
            </p>
            <button
              onClick={onNavigate}
              className="bg-brand-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full sm:w-auto mx-auto"
            >
              Obtenir ma Démo Personnalisée
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
