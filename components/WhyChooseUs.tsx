import React from 'react';
import CheckIcon from './icons/CheckIcon';
import LoadingSpinner from './icons/LoadingSpinner';

const BenefitItem = ({ title, description }: { title: string; description: string }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-brand-primary mt-1">
            <CheckIcon />
        </div>
        <div>
            <h4 className="text-lg font-bold text-brand-text-dark">{title}</h4>
            <p className="text-brand-text-dark/70">{description}</p>
        </div>
    </div>
);

interface WhyChooseUsProps {
    onNavigate: () => void;
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onNavigate }) => {
    const benefits = [
        { title: "Précision Scientifique", description: "Nos calculs ne sont pas une boîte noire. Ils sont basés sur des modèles agronomiques éprouvés. Fini les 'recettes' génériques, place à une nutrition calculée pour vos besoins." },
        { title: "Optimisation des Coûts & Ressources", description: "Cessez de gaspiller des engrais coûteux. En calibrant votre solution par le drainage, vous donnez à la plante uniquement ce qu'elle absorbe. Ni plus, ni moins." },
        { title: "Conçu sur le Terrain, pour le Terrain", description: "WISE DRIP est né de vos défis. Notre équipe est composée d'étudiants-ingénieurs en horticulture (APESA, IAT) et de spécialistes en Data Science. Nous parlons votre langue." },
        { title: "Rendement & Qualité", description: "Une plante parfaitement nourrie est une plante saine et productive. Visez un calibre supérieur, un taux de Brix plus élevé et une meilleure conservation." }
    ];

    return (
        <section className="py-20 bg-brand-text-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-brand-text-dark">
                        Le Meilleur de l'Agronomie et de la Data Science
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl mx-auto">
                    {/* FIX: Pass props explicitly by destructuring to avoid a TypeScript error when using spread syntax with a 'key' prop. */}
                    {benefits.map(({ title, description }) => (
                        <BenefitItem
                            key={title}
                            title={title}
                            description={description}
                        />
                    ))}
                </div>
                <div className="text-center mt-20">
                     <h3 className="text-3xl font-bold text-brand-text-dark mb-4">
                        Prêt à passer à la fertigation de précision ?
                    </h3>
                    <p className="max-w-3xl mx-auto text-brand-text-dark/70 mb-8">
                        Discutez directement avec notre équipe d'ingénieurs pour voir comment WISE DRIP peut s'intégrer à votre exploitation. La première étape vers une optimisation rentable.
                    </p>
                    <button
                        onClick={onNavigate}
                        className="bg-brand-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-w-[240px] mx-auto"
                    >
                        Planifier ma Démo
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;