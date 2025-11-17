// Step6_ResultsReport.jsx
import React, { useState, useEffect } from 'react';

const Toast = ({ message, onDone }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDone();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDone]);

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out no-print">
            {message}
        </div>
    );
};

const Step6_ResultsReport = ({ calculationResults, onModifyParameters }) => {
    const [showToast, setShowToast] = useState(false);

    if (!calculationResults) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-10 bg-white rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-700">No calculation results available to display.</p>
                     <button onClick={onModifyParameters} className="mt-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                           Go Back
                     </button>
                </div>
            </div>
        );
    }
    
    const { context, tanks, finalComposition, ionicRatios, costs, reportId } = calculationResults;

    const handlePrint = () => {
        window.print();
    };

    const handleSaveRecipe = async () => {
        console.log('Saving recipe for session:', reportId);
        // In a real app, this would be an API call:
        // await fetch(`/api/v1/recipes/from-session/${reportId}`, { method: 'POST' });
        setShowToast(true);
    };

    return (
        <>
            <style>
                {`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-container {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        max-width: 100% !important;
                    }
                    .print-section-title {
                        border-bottom: 2px solid #ccc !important;
                        padding-bottom: 8px !important;
                        margin-top: 24px !important;
                        color: black !important;
                    }
                     table { page-break-inside: auto }
                     tr    { page-break-inside: avoid; page-break-after: auto }
                }
                @keyframes fade-in-out {
                  0% { opacity: 0; transform: translateY(-20px); }
                  10% { opacity: 1; transform: translateY(0); }
                  90% { opacity: 1; transform: translateY(0); }
                  100% { opacity: 0; transform: translateY(-20px); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 3s ease-in-out forwards;
                }
                `}
            </style>
            
            {showToast && <Toast message="Recette sauvegardée avec succès !" onDone={() => setShowToast(false)} />}
            
            <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
                {/* Action Header */}
                <header className="no-print max-w-7xl mx-auto mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Calculation Report</h1>
                    <div className="flex items-center space-x-3">
                        <button onClick={onModifyParameters} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                           Modifier les Paramètres
                        </button>
                        <a href={`/api/v1/calculation-session/${reportId}/report.pdf`} download className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
                           Télécharger PDF
                        </a>
                        <button onClick={handlePrint} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                           Imprimer le Rapport
                        </button>
                         <button onClick={handleSaveRecipe} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                           Enregistrer comme Recette
                        </button>
                    </div>
                </header>

                {/* Report Content */}
                <div className="print-container max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
                    <header className="text-center mb-10 border-b pb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900">{context.calculationName}</h2>
                        <p className="text-md text-gray-500 mt-2">{context.crop} - {context.stage}</p>
                    </header>
                    
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-700">Ratio de Dilution</h3>
                            <p className="text-2xl font-semibold text-gray-900">{context.dilutionRatio}</p>
                         </div>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-700">Configuration des Bacs</h3>
                            <p className="text-2xl font-semibold text-gray-900">{context.tankConfiguration}</p>
                        </div>
                    </section>
                    
                    {/* Section 1: Tank Recipes */}
                    <section>
                        <h3 className="print-section-title text-xl font-bold text-gray-800 mb-4">La Recette des Bacs de Solutions Mères</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tanks.map(tank => (
                                <div key={tank.name} className="border rounded-lg overflow-hidden">
                                    <h4 className="font-bold text-lg p-3 bg-gray-100 border-b">{tank.name} (Volume : {tank.volume} L)</h4>
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50"><tr><th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th><th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th></tr></thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tank.recipe.map(item => <tr key={item.product}><td className="px-3 py-2 text-sm">{item.product}</td><td className="px-3 py-2 text-sm font-medium">{item.quantity}</td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* Section 2: Final Solution */}
                    <section className="mt-10">
                        <h3 className="print-section-title text-xl font-bold text-gray-800 mb-4">La Solution Nutritive Finale</h3>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {['Élément', 'Unité', 'Apport Eau', 'Cible', 'Solution Finale', 'Écart (%)'].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {finalComposition.map(el => (
                                            <tr key={el.element}>
                                                <td className="px-4 py-2 font-medium">{el.element}</td>
                                                <td className="px-4 py-2">{el.unit}</td>
                                                <td className="px-4 py-2 text-gray-600">{el.fromWater.toFixed(3)}</td>
                                                <td className="px-4 py-2 text-blue-600">{el.target.toFixed(3)}</td>
                                                <td className="px-4 py-2 font-bold text-green-700">{el.final.toFixed(3)}</td>
                                                <td className={`px-4 py-2 font-semibold ${Math.abs(el.diff) > 5 ? 'text-red-500' : 'text-gray-700'}`}>{el.diff.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="xl:col-span-1">
                                <div className="border rounded-lg">
                                    <h4 className="font-bold text-lg p-3 bg-gray-100 border-b">Ratios Ioniques</h4>
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50"><tr><th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Ratio</th><th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Cible</th><th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Atteint</th></tr></thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {ionicRatios.map(r => <tr key={r.ratio}><td className="px-3 py-2 text-sm">{r.ratio}</td><td className="px-3 py-2 text-sm">{r.target.toFixed(2)}</td><td className="px-3 py-2 text-sm font-medium">{r.final.toFixed(2)}</td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Section 3: Cost */}
                    <section className="mt-10">
                         <h3 className="print-section-title text-xl font-bold text-gray-800 mb-4">Coût Total</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800">Coût total des solutions mères</p>
                                <p className="text-2xl font-bold text-yellow-900">{costs.totalStockCost}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <p className="text-sm font-medium text-green-800">Coût par m³ de solution nutritive</p>
                                <p className="text-2xl font-bold text-green-900">{costs.costPerM3}</p>
                            </div>
                         </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Step6_ResultsReport;