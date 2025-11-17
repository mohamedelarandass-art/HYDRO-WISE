import React from 'react';
import DocumentIcon from './icons/DocumentIcon';
import CogIcon from './icons/CogIcon';
import ChartIcon from './icons/ChartIcon';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <div className="bg-brand-text-light p-8 rounded-2xl shadow-lg border border-brand-secondary text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
        <div className="mb-6 text-brand-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-brand-text-dark mb-3">{title}</h3>
        <p className="text-brand-text-dark/70">{description}</p>
    </div>
);

const HowItWorks: React.FC = () => {
    const features = [
        {
            icon: <DocumentIcon />,
            title: "Centralisez vos Données",
            description: "Saisissez les paramètres de votre exploitation : votre analyse d'eau, le stade de votre culture, le type de substrat et vos objectifs de rendement."
        },
        {
            icon: <CogIcon />,
            title: "Générez votre Programme",
            description: "Notre moteur de calcul, basé sur des modèles agronomiques avancés, conçoit votre programme de fertigation optimal (Solutions Mères A, B, C...)."
        },
        {
            icon: <ChartIcon />,
            title: "Calibrez par le Drainage",
            description: "Entrez manuellement votre analyse de drainage. WISE DRIP compare votre solution en sortie avec les objectifs, et vous fournit les ajustements précis pour une assimilation parfaite. (Bientôt en mode 100% automatique !)"
        }
    ];

    return (
        <section className="py-20 bg-brand-secondary/20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-brand-text-dark mb-16">
                    De vos Analyses au Programme Nutritif Parfait
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* FIX: Pass props explicitly by destructuring to avoid a TypeScript error when using spread syntax with a 'key' prop. */}
                    {features.map(({ icon, title, description }) => (
                        <FeatureCard
                            key={title}
                            icon={icon}
                            title={title}
                            description={description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;