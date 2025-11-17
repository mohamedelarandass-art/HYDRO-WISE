// Step4_FertilizerSelection.jsx
import React from 'react';
import { elements as elementsData } from '../data/elements.js';
import LoadingSpinner from './icons/LoadingSpinner.tsx';

const CONVERSION_FACTORS = {
    P: { toOxide: 2.291, fromOxide: 0.436 },
    K: { toOxide: 1.205, fromOxide: 0.830 },
    Ca: { toOxide: 1.399, fromOxide: 0.715 },
    Mg: { toOxide: 1.658, fromOxide: 0.603 },
};

const CHELATE_OPTIONS = ['EDDHA', 'DTPA', 'EDTA', 'Autre'];
const MICROS_WITH_CHELATES = ['Fe', 'Mn', 'Zn', 'Cu'];

// -- FERTILIZER MODAL COMPONENT --
const FertilizerModal = ({ isOpen, onClose, onSave, fertilizerToEdit }) => {
    const initialFormState = React.useMemo(() => ({
        name: '', type: 'Solid', density: '', purity: '',
        composition: { P: '', P2O5: '', K: '', K2O: '', Ca: '', CaO: '', Mg: '', MgO: '', N_NO3: '', N_NH4: '', S: '', Fe: '', Mn: '', Zn: '', Cu: '', B: '', Mo: '' },
        chelates: { Fe: '', Mn: '', Zn: '', Cu: '' }, otherChelates: { Fe: '', Mn: '', Zn: '', Cu: '' },
    }), []);

    const [formData, setFormData] = React.useState(initialFormState);
    const [isSaving, setIsSaving] = React.useState(false);
    const lastUserInput = React.useRef(null);
    const modalRef = React.useRef(null);
    const firstFocusableElementRef = React.useRef(null);

    React.useEffect(() => {
        if (isOpen) {
            setFormData(fertilizerToEdit ? JSON.parse(JSON.stringify(fertilizerToEdit)) : initialFormState);
            firstFocusableElementRef.current?.focus();
        }
    }, [isOpen, fertilizerToEdit, initialFormState]);
    
    // Focus trapping and Escape key listener
    React.useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Tab') {
                const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleCompositionChange = (name, value) => {
        lastUserInput.current = { name, value };
        setFormData(prev => ({ ...prev, composition: { ...prev.composition, [name]: value } }));
    };

    React.useEffect(() => {
        if (!lastUserInput.current) return;
        const { name, value } = lastUserInput.current;
        const newComposition = { ...formData.composition };

        Object.entries(CONVERSION_FACTORS).forEach(([el, factors]) => {
            const oxide = `${el}2O5` in newComposition ? `${el}2O5` : `${el}O`;
            if (name === el) {
                const val = parseFloat(value);
                newComposition[oxide] = isNaN(val) ? '' : (val * factors.toOxide).toFixed(3);
            } else if (name === oxide) {
                const val = parseFloat(value);
                newComposition[el] = isNaN(val) ? '' : (val * factors.fromOxide).toFixed(3);
            }
        });
        setFormData(prev => ({ ...prev, composition: newComposition }));
    }, [formData.composition]);

    const handleSave = (saveAsNew = false) => {
        // Simple validation
        if (!formData.name) {
            alert("Fertilizer name is required.");
            return;
        }
        setIsSaving(true);
        setTimeout(() => { // Simulate async save
            const finalComposition = {};
            Object.entries(formData.composition).forEach(([key, value]) => {
                const isElemental = elementsData.some(el => el.id === key) || ['N_NO3', 'N_NH4', 'S'].includes(key);
                if (isElemental && value && parseFloat(value) > 0) {
                    finalComposition[key] = parseFloat(value);
                }
            });
            const newFertilizer = {
                id: (saveAsNew || !fertilizerToEdit?.id) ? `custom-${Date.now()}` : fertilizerToEdit.id,
                name: formData.name, type: formData.type, isSystem: false, category: 'Custom Fertilizers',
                composition: finalComposition, 
                density: formData.type === 'Liquid/Acid' ? formData.density : '',
                purity: formData.type === 'Liquid/Acid' ? formData.purity : '',
                chelates: formData.chelates,
            };
            onSave(newFertilizer);
            setIsSaving(false);
            onClose();
        }, 500);
    };

    if (!isOpen) return null;
    
    const OxideInput = ({ el }) => (
        <div className="flex items-center space-x-2">
            <input type="number" placeholder={el} value={formData.composition[el] || ''} onChange={e => handleCompositionChange(el, e.target.value)} className="w-full p-1 border rounded-md text-sm"/>
            <span className="text-gray-500">&harr;</span>
            <input type="number" placeholder={`${el}${el==='P' ? '₂O₅' : 'O'}`} value={formData.composition[`${el}${el==='P' ? '2O5' : 'O'}`] || ''} onChange={e => handleCompositionChange(`${el}${el==='P' ? '2O5' : 'O'}`, e.target.value)} className="w-full p-1 border rounded-md text-sm"/>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog" aria-labelledby="modal-title">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 id="modal-title" className="text-xl font-bold text-gray-800">{fertilizerToEdit ? 'Edit Fertilizer' : 'Add Custom Fertilizer'}</h2>
                    <button onClick={onClose} aria-label="Close modal" className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <fieldset className="p-4 border rounded-md">
                            <legend className="font-semibold px-2">General Info</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Name <span className="text-red-500">*</span></label>
                                    <input ref={firstFocusableElementRef} type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="mt-1 w-full p-2 border rounded-md"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Type</label>
                                    <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="mt-1 w-full p-2 border rounded-md">
                                        <option>Solid</option><option>Liquid/Acid</option>
                                    </select>
                                </div>
                                {formData.type === 'Liquid/Acid' && <>
                                    <div>
                                        <label className="block text-sm font-medium">Density (kg/L)</label>
                                        <input type="number" value={formData.density} onChange={e => setFormData(p => ({ ...p, density: e.target.value }))} className="mt-1 w-full p-2 border rounded-md"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Purity (%)</label>
                                        <input type="number" value={formData.purity} onChange={e => setFormData(p => ({ ...p, purity: e.target.value }))} className="mt-1 w-full p-2 border rounded-md"/>
                                    </div>
                                </>}
                            </div>
                        </fieldset>

                        <fieldset className="p-4 border rounded-md">
                            <legend className="font-semibold px-2">Composition (%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 text-sm">
                                {['N_NO3', 'N_NH4', 'S', 'B', 'Mo'].map(el => <div key={el}><label>{el.replace('_', '-')}</label><input type="number" value={formData.composition[el] || ''} onChange={e => handleCompositionChange(el, e.target.value)} className="mt-1 w-full p-1 border rounded-md"/></div>)}
                                <OxideInput el="P" />
                                <OxideInput el="K" />
                                <OxideInput el="Ca" />
                                <OxideInput el="Mg" />
                                {MICROS_WITH_CHELATES.map(el => <div key={el}><label>{el}</label><input type="number" value={formData.composition[el] || ''} onChange={e => handleCompositionChange(el, e.target.value)} className="mt-1 w-full p-1 border rounded-md"/></div>)}
                            </div>
                        </fieldset>

                         <fieldset className="p-4 border rounded-md">
                            <legend className="font-semibold px-2">Chelates (for Micronutrients)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {MICROS_WITH_CHELATES.map(el => (
                                    <div key={el}>
                                        <label className="font-medium">{el}</label>
                                        <select value={formData.chelates[el] || ''} onChange={e => setFormData(p => ({...p, chelates: {...p.chelates, [el]: e.target.value}}))} className="mt-1 w-full p-1 border rounded-md">
                                            <option value="">None</option>
                                            {CHELATE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        {formData.chelates[el] === 'Autre' && <input type="text" placeholder="Specify chelate" value={formData.otherChelates[el] || ''} onChange={e => setFormData(p => ({...p, otherChelates: {...p.otherChelates, [el]: e.target.value}}))} className="mt-1 w-full p-1 border rounded-md"/>}
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </main>
                <footer className="p-4 border-t flex justify-between items-center bg-gray-50 rounded-b-lg flex-shrink-0">
                    <button onClick={() => setFormData(initialFormState)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100">Clear Form</button>
                    <div className="space-x-3">
                        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">Cancel</button>
                        {fertilizerToEdit ? (<>
                            <button onClick={() => handleSave(true)} disabled={isSaving} className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm font-medium">Save as New</button>
                            <button onClick={() => handleSave(false)} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium min-w-[120px] text-center">{isSaving ? <LoadingSpinner/> : 'Save Changes'}</button>
                        </>) : (
                             <button onClick={() => handleSave(false)} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium min-w-[80px] text-center">{isSaving ? <LoadingSpinner/> : 'Save'}</button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

const ComparisonModal = ({ isOpen, onClose, fertilizers }) => {
    if (!isOpen) return null;
    const elements = ['N_NO3', 'N_NH4', 'P', 'K', 'Ca', 'Mg', 'S', 'Fe', 'Mn', 'Zn', 'Cu', 'B', 'Mo'];

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                 <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Compare Fertilizers</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                 </header>
                 <main className="p-6 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrient</th>
                                {fertilizers.map(f => <th key={f.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{f.name}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {elements.map(el => (
                                <tr key={el}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{el.replace('_','-')}</td>
                                    {fertilizers.map(f => <td key={f.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.composition[el] || '0'}%</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </main>
                 <footer className="p-4 border-t bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                 </footer>
            </div>
         </div>
    );
};

const CostAnalysisModal = ({ isOpen, onClose, fertilizers, costs, currencySymbol }) => {
    const [nutrient, setNutrient] = React.useState('N');
    if (!isOpen) return null;

    const nutrientSources = { 'N': ['N_NO3', 'N_NH4'], 'P': ['P'], 'K': ['K'], 'Ca': ['Ca'], 'Mg': ['Mg'], 'S': ['S'] };

    const results = fertilizers.map(fert => {
        const totalNutrientPercent = nutrientSources[nutrient].reduce((sum, el) => sum + (fert.composition[el] || 0), 0);
        const cost = parseFloat(costs[fert.id]);
        if (totalNutrientPercent > 0 && cost > 0) {
            const costPerKgNutrient = (cost / (totalNutrientPercent / 100)).toFixed(2);
            return { name: fert.name, cost: `${costPerKgNutrient} ${currencySymbol}/kg of ${nutrient}` };
        }
        return { name: fert.name, cost: 'N/A' };
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Nutrient Cost Analysis</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Select Nutrient to Analyze:</label>
                        <select value={nutrient} onChange={e => setNutrient(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
                            {Object.keys(nutrientSources).map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {results.map(res => <li key={res.name} className="flex justify-between p-2 bg-gray-50 rounded"><span>{res.name}</span><span className="font-semibold">{res.cost}</span></li>)}
                    </ul>
                </main>
            </div>
        </div>
    );
};

const FertilizerRow = React.memo(({ fertilizer, isSelected, cost, onSelect, onCostChange, onEdit, onDelete, currencySymbol }) => {
    return (
        <div className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-gray-50 border-b">
            <div className="col-span-1 flex justify-center">
                <input type="checkbox" checked={isSelected} onChange={() => onSelect(fertilizer.id)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500"/>
            </div>
            <div className="col-span-5">
                <p className="font-semibold text-gray-800">{fertilizer.name}</p>
                {!fertilizer.isSystem && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Custom</span>}
            </div>
            <div className="col-span-4">
                 <div className="relative">
                    <input type="number" value={cost} onChange={e => onCostChange(fertilizer.id, e.target.value)} placeholder="0.00" className="w-full p-2 pr-12 border rounded-md"/>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">{currencySymbol}/kg</span>
                </div>
            </div>
            <div className="col-span-2 flex items-center justify-end space-x-2">
                {!fertilizer.isSystem && (<>
                    <button onClick={() => onEdit(fertilizer)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-md">Edit</button>
                    <button onClick={() => onDelete(fertilizer.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-md">Delete</button>
                </>)}
            </div>
        </div>
    );
});


const Step4_FertilizerSelection = ({ fertilizersList, userDefaultInventoryIds, currencySymbol, onBack, onNext }) => {
    const [allFertilizers, setAllFertilizers] = React.useState(fertilizersList);
    const [selectedIds, setSelectedIds] = React.useState(new Set(userDefaultInventoryIds));
    const [costs, setCosts] = React.useState({});
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [fertilizerToEdit, setFertilizerToEdit] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isCompareModalOpen, setIsCompareModalOpen] = React.useState(false);
    const [isCostModalOpen, setIsCostModalOpen] = React.useState(false);
    const addFertilizerBtnRef = React.useRef(null);

    const filteredFertilizers = React.useMemo(() => {
        if (!searchQuery) return allFertilizers;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return allFertilizers.filter(fert => fert.name.toLowerCase().includes(lowerCaseQuery) || fert.category.toLowerCase().includes(lowerCaseQuery));
    }, [allFertilizers, searchQuery]);

    const categorizedFertilizers = React.useMemo(() => {
        return filteredFertilizers.reduce((acc, fert) => {
            const category = fert.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(fert);
            return acc;
        }, {});
    }, [filteredFertilizers]);

    const handleSelect = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    
    const handleCostChange = (id, value) => setCosts(prev => ({...prev, [id]: value}));

    const openModal = (fertilizer = null) => {
        setFertilizerToEdit(fertilizer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFertilizerToEdit(null);
        addFertilizerBtnRef.current?.focus();
    };
    
    const handleSaveCustomFertilizer = (newFertilizer) => {
        setAllFertilizers(prev => {
            const existingIndex = prev.findIndex(f => f.id === newFertilizer.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = newFertilizer;
                return updated;
            }
            return [...prev, newFertilizer];
        });
        setSelectedIds(prev => new Set(prev).add(newFertilizer.id));
    };

    const handleDelete = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this custom fertilizer?")) {
            setAllFertilizers(prev => prev.filter(f => f.id !== idToDelete));
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(idToDelete);
                return newSet;
            });
        }
    };

    const handleSubmit = () => {
        const submissionData = {
            selectedFertilizers: Array.from(selectedIds).map(id => allFertilizers.find(f => f.id === id)),
            costs: costs
        };
        console.log("Submitting Step 4 Data:", submissionData);
        if(onNext) onNext(submissionData);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Fertilizer & Acid Selection (Step 4)</h1>
                    <p className="text-sm text-gray-600 mb-6">Select products available for this calculation and specify their costs.</p>
                </header>

                <div className="mb-6 sticky top-0 bg-white py-4 z-10 -mx-8 px-8 border-b">
                    <input type="text" placeholder="Search by name or category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                
                <div className="space-y-8">
                    {Object.entries(categorizedFertilizers).map(([category, fertilizers]) => (
                        <fieldset key={category}>
                             <legend className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 w-full">{category}</legend>
                             <div className="space-y-2">
                                {fertilizers.map(fert => (
                                    <FertilizerRow key={fert.id} fertilizer={fert} isSelected={selectedIds.has(fert.id)} cost={costs[fert.id] || ''} onSelect={handleSelect} onCostChange={handleCostChange} onEdit={openModal} onDelete={handleDelete} currencySymbol={currencySymbol} />
                                ))}
                             </div>
                        </fieldset>
                    ))}
                </div>

                <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap gap-4">
                    <button ref={addFertilizerBtnRef} onClick={() => openModal()} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                        + Add Custom Fertilizer
                    </button>
                    <button onClick={() => setIsCompareModalOpen(true)} disabled={selectedIds.size < 2} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                        Compare Selected ({selectedIds.size})
                    </button>
                     <button onClick={() => setIsCostModalOpen(true)} disabled={selectedIds.size < 1} className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 disabled:bg-gray-400">
                        Nutrient Cost Analysis
                    </button>
                </div>
                
                <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
                    <button type="button" onClick={onBack} className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        &larr; Back
                    </button>
                    <button type="button" onClick={handleSubmit} className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Continue to Calculation
                    </button>
                </div>
            </div>

            <FertilizerModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveCustomFertilizer} fertilizerToEdit={fertilizerToEdit}/>
            <ComparisonModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} fertilizers={allFertilizers.filter(f => selectedIds.has(f.id))} />
            <CostAnalysisModal isOpen={isCostModalOpen} onClose={() => setIsCostModalOpen(false)} fertilizers={allFertilizers.filter(f => selectedIds.has(f.id))} costs={costs} currencySymbol={currencySymbol} />
        </div>
    );
};

export default Step4_FertilizerSelection;
