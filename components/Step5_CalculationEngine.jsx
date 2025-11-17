// Step5_CalculationEngine.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './icons/LoadingSpinner.tsx';

const ErrorMessage = ({ error }) => {
    if (!error) return null;

    let title = "Error";
    let message;

    switch (error.errorCode) {
        case 'STABILITY_ERROR_KPS':
            title = "Erreur de Stabilité";
            message = "Votre recette cible demande des concentrations de Calcium et de Sulfate/Phosphate qui précipiteront inévitablement, même après dilution. Veuillez réduire l'un de ces éléments dans votre recette cible (Étape 3).";
            break;
        case 'OPTIMIZATION_UNFEASIBLE':
            title = "Calcul Impossible";
            message = `Le calcul n'a pas pu aboutir: ${error.message}. Veuillez ajuster votre inventaire (Étape 4) ou vos cibles (Étape 3).`;
            break;
        case 'MOTHER_TANK_SOLUBILITY_EXCEEDED':
            title = "Risque de Précipitation";
            message = `ERREUR: ${error.message}. La concentration de l'un des engrais dépasse la limite de solubilité dans un bac. Action recommandée : Augmentez le volume de vos bacs ou le ratio de dilution (Étape 1).`;
            break;
        case 'GENERIC_VALIDATION_ERROR':
            title = "Erreur de Validation";
            message = "Une erreur inattendue est survenue. Veuillez vérifier les données des étapes précédentes.";
            break;
        default:
            title = "Erreur Inconnue";
            message = "Une erreur inattendue est survenue lors de la communication avec le serveur. Veuillez réessayer.";
            break;
    }

    return (
        <div role="alert" aria-live="assertive" className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <h3 className="text-lg font-bold text-red-800">{title}</h3>
            <p className="mt-2 text-sm text-red-700">{message}</p>
        </div>
    );
};

const Step5_CalculationEngine = ({
    initialConfigData,
    waterAnalysisData,
    targetRecipeData,
    fertilizerSelectionData,
    onNext,
    onBack
}) => {
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [error, setError] = useState(null);
    const [availableAcids, setAvailableAcids] = useState([]);
    const [selectedAcidId, setSelectedAcidId] = useState('');

    useEffect(() => {
        const acids = fertilizerSelectionData?.selectedFertilizers?.filter(f => f.category === 'Acids') || [];
        setAvailableAcids(acids);
        if (acids.length > 0) {
            setSelectedAcidId(acids[0].id);
        }
    }, [fertilizerSelectionData]);

    const handleCalculate = async () => {
        setStatus('loading');
        setError(null);

        const payload = {
            initialConfig: initialConfigData,
            waterAnalysis: waterAnalysisData,
            targetRecipe: targetRecipeData,
            fertilizerInventory: fertilizerSelectionData,
            phAdjustment: {
                selectedAcidId: selectedAcidId
            }
        };

        try {
            // In a real application, you would replace this with a real fetch call
            // const response = await fetch('/api/v1/calculate', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            // MOCKING API CALL FOR DEMONSTRATION
            await new Promise(resolve => setTimeout(resolve, 2000));
            // To test error cases, you can uncomment one of the following lines:
            // throw { errorCode: 'STABILITY_ERROR_KPS', message: 'High concentrations of Calcium and Sulfate detected.' };
            // throw { errorCode: 'OPTIMIZATION_UNFEASIBLE', message: 'Cible de Potassium non atteinte. Manque 1.25 mM/L' };
            // throw { errorCode: 'MOTHER_TANK_SOLUBILITY_EXCEEDED', message: 'Risque de précipitation dans le Bac A. La concentration de Nitrate de Calcium dépasse la limite de solubilité' };
            
            const mockResponse = { ok: true, json: () => Promise.resolve({ data: "Calculation successful!", tanks: {} }) };
            // END MOCK

            if (!mockResponse.ok) {
                const errorData = await mockResponse.json();
                throw errorData;
            }

            const resultData = await mockResponse.json();
            setStatus('success');
            onNext(resultData);

        } catch (err) {
            console.error("Calculation API Error:", err);
            setError(err);
            setStatus('error');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <header className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Calculation Engine (Step 5)</h1>
                    <p className="text-sm text-gray-600 mb-6">Launch the calculation to generate the optimal tank recipe.</p>
                </header>

                <div className="space-y-6 border-t pt-6">
                    <div>
                        {availableAcids.length > 0 ? (
                            <>
                                <label htmlFor="acid-selector" className="block text-sm font-medium text-gray-700 mb-2">
                                    Acide principal pour le contrôle du pH
                                </label>
                                <select
                                    id="acid-selector"
                                    value={selectedAcidId}
                                    onChange={(e) => setSelectedAcidId(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    disabled={status === 'loading'}
                                >
                                    {availableAcids.map(acid => (
                                        <option key={acid.id} value={acid.id}>{acid.name}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <div className="text-center bg-gray-100 p-4 rounded-md text-sm text-gray-700">
                                <p>Aucun acide sélectionné à l'étape 4. Le pH de la solution finale ne sera pas ajusté.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center">
                        <button
                            onClick={handleCalculate}
                            disabled={status === 'loading'}
                            className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-3">Calculating...</span>
                                </>
                            ) : (
                                'Calculer la recette des bacs'
                            )}
                        </button>
                    </div>

                    <ErrorMessage error={error} />

                </div>

                <div className="mt-8 pt-5 border-t border-gray-200 flex justify-start">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={status === 'loading'}
                        className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-200"
                    >
                        &larr; Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step5_CalculationEngine;
