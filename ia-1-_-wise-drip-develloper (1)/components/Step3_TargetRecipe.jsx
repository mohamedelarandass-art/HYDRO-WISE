// Step3_TargetRecipe.jsx
import React from 'react';
import { elements as elementsData } from '../data/elements.js';

// Define the mandatory display order and separate into macro/micro
const ELEMENT_ORDER = ['HCO3', 'NO3', 'NH4', 'P', 'K', 'Ca', 'Mg', 'Na', 'S', 'Cl', 'Fe', 'B', 'Cu', 'Zn', 'Mn', 'Mo'];

const sortedElements = ELEMENT_ORDER.map(id => elementsData.find(el => el.id === id)).filter(Boolean);
const macroElements = sortedElements.filter(el => el.category === 'macro');
const microElements = sortedElements.filter(el => el.category === 'micro');

// Helper component for table rows
const ElementRow = ({ element, waterContribution, targetValue, onTargetChange, unit }) => {
    const requiredContribution = React.useMemo(() => {
        if (targetValue === '' || isNaN(parseFloat(targetValue))) {
            return '';
        }
        return parseFloat(targetValue) - waterContribution;
    }, [targetValue, waterContribution]);

    const isSurplus = requiredContribution !== '' && requiredContribution <= 0;

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3 text-sm font-medium text-gray-800">{element.displayName}</td>
            <td className="p-3 text-sm text-gray-600 bg-gray-50">{waterContribution.toFixed(4)}</td>
            <td className="p-2">
                <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => onTargetChange(element.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Target in ${unit}`}
                />
            </td>
            <td className={`p-3 text-sm font-semibold ${isSurplus ? 'text-red-600' : 'text-green-700'}`}>
                {requiredContribution === '' ? '-' : requiredContribution.toFixed(4)}
            </td>
        </tr>
    );
};

// Helper component for ratio display
const RatioDisplay = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm p-2 bg-gray-100 rounded">
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="font-bold text-gray-900">{isNaN(value) || !isFinite(value) ? 'N/A' : value.toFixed(2)}</span>
    </div>
);


const Step3_TargetRecipe = ({ waterAnalysisData, recipeTemplates, onBack, onNext }) => {
    const [recipes, setRecipes] = React.useState(recipeTemplates);
    const [selectedRecipeId, setSelectedRecipeId] = React.useState('');
    const [currentRecipe, setCurrentRecipe] = React.useState({});
    const [recipeName, setRecipeName] = React.useState('');
    const [isEditingPersonalRecipe, setIsEditingPersonalRecipe] = React.useState(false);

    React.useEffect(() => {
        // Load the first system recipe by default on component mount
        if (recipes.length > 0) {
            const firstSystemRecipe = recipes.find(r => r.isSystemRecipe);
            if(firstSystemRecipe) {
                loadRecipe(firstSystemRecipe);
                setSelectedRecipeId(firstSystemRecipe.id);
            }
        }
    }, []); // Run only once

    const loadRecipe = (recipe) => {
        if (!recipe) return;
        const newTargets = {};
        // Initialize targets for all elements to avoid uncontrolled component warnings
        ELEMENT_ORDER.forEach(elId => {
             newTargets[elId] = recipe.targets?.[elId] || '';
        });
        setCurrentRecipe(newTargets);
        setRecipeName(recipe.name);
        setIsEditingPersonalRecipe(!recipe.isSystemRecipe);
    };

    const handleLoadClick = () => {
        const recipeToLoad = recipes.find(r => r.id === selectedRecipeId);
        if (recipeToLoad) {
            loadRecipe(recipeToLoad);
        }
    };
    
    const handleCreateNew = () => {
        const newTargets = {};
        ELEMENT_ORDER.forEach(elId => { newTargets[elId] = ''; });
        setCurrentRecipe(newTargets);
        setRecipeName('New Custom Recipe');
        setSelectedRecipeId('');
        setIsEditingPersonalRecipe(true);
    };

    const handleDuplicate = () => {
        const recipeToDuplicate = recipes.find(r => r.id === selectedRecipeId);
        if(recipeToDuplicate) {
            loadRecipe(recipeToDuplicate);
            setRecipeName(`Copy of ${recipeToDuplicate.name}`);
            setSelectedRecipeId(''); // It's a new, unsaved recipe
            setIsEditingPersonalRecipe(true);
        }
    };

    const handleSave = () => {
        const existingRecipe = recipes.find(r => r.id === selectedRecipeId && !r.isSystemRecipe);
        if (existingRecipe) { // Update existing personal recipe
            const updatedRecipes = recipes.map(r => r.id === selectedRecipeId ? { ...r, name: recipeName, targets: currentRecipe } : r);
            setRecipes(updatedRecipes);
            alert(`Recipe '${recipeName}' updated!`);
        } else { // Save as a new personal recipe
            const newRecipe = {
                id: `user${Date.now()}`,
                name: recipeName,
                isSystemRecipe: false,
                targets: currentRecipe,
            };
            setRecipes(prev => [...prev, newRecipe]);
            setSelectedRecipeId(newRecipe.id);
            alert(`Recipe '${recipeName}' saved!`);
        }
    };

    const handleDelete = () => {
        if(selectedRecipeId && !recipes.find(r => r.id === selectedRecipeId)?.isSystemRecipe) {
             if (window.confirm("Are you sure you want to delete this recipe?")) {
                setRecipes(prev => prev.filter(r => r.id !== selectedRecipeId));
                handleCreateNew();
             }
        }
    };

    const handleTargetChange = React.useCallback((elementId, value) => {
        setCurrentRecipe(prev => ({ ...prev, [elementId]: value }));
    }, []);

    const ionicRatios = React.useMemo(() => {
        const getVal = (id) => parseFloat(currentRecipe[id]) || 0;
        const no3 = getVal('NO3');
        const nh4 = getVal('NH4');
        const k = getVal('K');
        const ca = getVal('Ca');
        const mg = getVal('Mg');

        return {
            n_k: k > 0 ? (no3 + nh4) / k : 0,
            k_ca: ca > 0 ? k / ca : 0,
            ca_mg: mg > 0 ? ca / mg : 0,
        };
    }, [currentRecipe]);

    const handleSubmit = () => {
        const finalRecipe = {
            name: recipeName,
            targets_mM: {},
            required_contribution_mM: {},
        };

        [...macroElements, ...microElements].forEach(el => {
            const targetValue = parseFloat(currentRecipe[el.id]);
            if (isNaN(targetValue)) return;
            
            const waterValue_mM = waterAnalysisData?.[el.id] || 0;
            const unitMultiplier = el.category === 'micro' ? 1000 : 1;

            const targetValue_mM = targetValue / unitMultiplier;
            finalRecipe.targets_mM[el.id] = targetValue_mM;

            const required = targetValue_mM - waterValue_mM;
            finalRecipe.required_contribution_mM[el.id] = Math.max(0, required); // Rule: negative values are treated as 0
        });
        
        console.log("Final Recipe for Submission:", finalRecipe);
        if(onNext) onNext(finalRecipe);
    };
    
    const selectedRecipeIsSystem = recipes.find(r => r.id === selectedRecipeId)?.isSystemRecipe ?? false;

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Target Recipe (Step 3)</h1>
                    <p className="text-sm text-gray-600 mb-6">Define your target nutrient recipe based on your water analysis.</p>
                </header>

                {/* Recipe Management */}
                <fieldset className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <legend className="font-semibold text-lg px-2 text-gray-800">Recipe Library</legend>
                    <div className="flex flex-wrap items-center gap-3">
                        <select value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} className="p-2 border border-gray-300 rounded-md min-w-[250px] flex-grow">
                             <optgroup label="WISE DRIP Recipes">
                                {recipes.filter(r => r.isSystemRecipe).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </optgroup>
                            <optgroup label="My Personal Recipes">
                                {recipes.filter(r => !r.isSystemRecipe).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </optgroup>
                        </select>
                        <button type="button" onClick={handleLoadClick} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400" disabled={!selectedRecipeId}>Load</button>
                        <button type="button" onClick={handleDuplicate} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400" disabled={!selectedRecipeId}>Duplicate</button>
                        <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!selectedRecipeId || selectedRecipeIsSystem}>Delete</button>
                        <button type="button" onClick={handleCreateNew} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create New</button>
                    </div>
                </fieldset>

                {/* Main Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 mb-4">
                            <label htmlFor="recipeName" className="font-semibold text-gray-700">Recipe Name:</label>
                            <input
                                id="recipeName"
                                type="text"
                                value={recipeName}
                                onChange={e => setRecipeName(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-md"
                                readOnly={!isEditingPersonalRecipe}
                            />
                            <button type="button" onClick={handleSave} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isEditingPersonalRecipe}>Save</button>
                        </div>
                        
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Element</th>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">From Water</th>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Your Target</th>
                                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Required Contribution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-200"><td colSpan="4" className="p-2 font-bold text-gray-700 text-center">Macro-elements (mM/L)</td></tr>
                                    {macroElements.map(el => (
                                        <ElementRow
                                            key={el.id}
                                            element={el}
                                            waterContribution={waterAnalysisData?.[el.id] || 0}
                                            targetValue={currentRecipe[el.id] || ''}
                                            onTargetChange={handleTargetChange}
                                            unit="mM/L"
                                        />
                                    ))}
                                    <tr className="bg-gray-200"><td colSpan="4" className="p-2 font-bold text-gray-700 text-center">Micro-elements (µM/L)</td></tr>
                                    {microElements.map(el => (
                                        <ElementRow
                                            key={el.id}
                                            element={el}
                                            waterContribution={(waterAnalysisData?.[el.id] || 0) * 1000}
                                            targetValue={currentRecipe[el.id] ? currentRecipe[el.id] * 1000 : ''}
                                            onTargetChange={(id, val) => handleTargetChange(id, val / 1000)}
                                            unit="µM/L"
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     {/* Ratios Panel */}
                    <aside className="lg:col-span-1 space-y-4">
                         <div className="p-4 border rounded-lg bg-white shadow-sm">
                            <h3 className="font-bold text-lg mb-3 text-gray-800">Key Ionic Ratios</h3>
                             <div className="space-y-2">
                                <RatioDisplay label="N/K" value={ionicRatios.n_k} />
                                <RatioDisplay label="K/Ca" value={ionicRatios.k_ca} />
                                <RatioDisplay label="Ca/Mg" value={ionicRatios.ca_mg} />
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
                    <button type="button" onClick={onBack} className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        &larr; Back
                    </button>
                    <button type="button" onClick={handleSubmit} className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Finish & Calculate
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Step3_TargetRecipe;