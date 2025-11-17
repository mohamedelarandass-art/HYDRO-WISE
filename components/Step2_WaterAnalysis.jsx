// Step2_WaterAnalysis.jsx
import React from 'react';
import { elements as elementsData } from '../data/elements.js';
import { convertToMmol, convertFromMmol, calculateIonicBalance } from '../utils/conversions.js';

const mockProfiles = [
    { id: 1, name: "Puits Nord - Été 2025", data: { ec: 0.8, ecUnit: 'dS/m', ph: 7.2, elements: { 'Ca': { value: 60, unit: 'ppm' }, 'Mg': { value: 24, unit: 'ppm' }, 'NO3': { value: 15, unit: 'ppm' } } } },
    { id: 2, name: "Puits Sud - Hiver 2025", data: { ec: 650, ecUnit: 'µS/cm', ph: 6.8, elements: { 'Ca': { value: 1.2, unit: 'mM/L' }, 'K': { value: 0.5, unit: 'mM/L' } } } },
];

const getInitialFormData = () => {
    const initialElements = {};
    elementsData.forEach(el => {
        initialElements[el.id] = { value: '', unit: 'ppm', form: el.forms ? el.forms[0].name : undefined };
    });
    return {
        analysisName: '',
        ec: '',
        ecUnit: 'dS/m',
        ph: '',
        elements: initialElements,
    };
};

const ElementInputRow = ({ element, value, unit, form, onValueChange, onUnitChange, onFormChange, disabled }) => {
    return (
        <tr className="border-b border-gray-200">
            <td className="py-3 px-4 text-sm font-medium text-gray-800">{element.name} ({element.symbol})</td>
            <td className="py-2 px-4">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onValueChange(element.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    disabled={disabled}
                />
            </td>
            <td className="py-2 px-4">
                <select value={unit} onChange={(e) => onUnitChange(element.id, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" disabled={disabled}>
                    <option value="ppm">ppm</option>
                    <option value="mM/L">mM/L</option>
                    <option value="meq/L">meq/L</option>
                </select>
            </td>
            <td className="py-2 px-4">
                {element.is_ambiguous && (
                    <select value={form} onChange={(e) => onFormChange(element.id, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" disabled={disabled}>
                        {element.forms.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                    </select>
                )}
            </td>
        </tr>
    );
};

const UnitConverterTool = ({ elements }) => {
    const [state, setState] = React.useState({ value: '', fromUnit: 'ppm', toUnit: 'mM/L', elementId: elements[0]?.id || '' });
    const [result, setResult] = React.useState('');

    const getElement = (id) => elements.find(el => el.id === id);

    React.useEffect(() => {
        const { value, fromUnit, toUnit, elementId } = state;
        if (value && elementId) {
            const element = getElement(elementId);
            const molarMass = element.molar_mass_g_mol;
            const valence = element.valence;
            const valInMmol = convertToMmol({ value, unit: fromUnit, molarMass, valence });
            const finalValue = convertFromMmol({ value: valInMmol, unit: toUnit, molarMass, valence });
            setResult(finalValue.toFixed(4));
        } else {
            setResult('');
        }
    }, [state, elements]);

    const handleChange = (e) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-2xl border w-80 z-20">
            <h4 className="font-bold text-md mb-3 text-gray-800">Unit Conversion Tool</h4>
            <div className="space-y-3 text-sm">
                <input type="number" name="value" value={state.value} onChange={handleChange} placeholder="Value" className="w-full p-2 border rounded-md" />
                <select name="elementId" value={state.elementId} onChange={handleChange} className="w-full p-2 border rounded-md">
                    {elements.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                </select>
                <div className="flex items-center space-x-2">
                    <select name="fromUnit" value={state.fromUnit} onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="ppm">ppm</option>
                        <option value="mM/L">mM/L</option>
                        <option value="meq/L">meq/L</option>
                    </select>
                    <span>to</span>
                    <select name="toUnit" value={state.toUnit} onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="ppm">ppm</option>
                        <option value="mM/L">mM/L</option>
                        <option value="meq/L">meq/L</option>
                    </select>
                </div>
                <div className="mt-2 text-center bg-gray-100 p-2 rounded-md">
                    <span className="font-semibold text-lg text-indigo-600">{result || '...'}</span>
                    <span className="text-gray-600 ml-2">{state.toUnit}</span>
                </div>
            </div>
        </div>
    );
};


const Step2_WaterAnalysis = ({ onBack, onNext }) => {
    const [profiles, setProfiles] = React.useState(mockProfiles);
    const [selectedProfileId, setSelectedProfileId] = React.useState('');
    const [formData, setFormData] = React.useState(getInitialFormData());
    const [isPureWater, setIsPureWater] = React.useState(false);
    const [ionicBalanceWarning, setIonicBalanceWarning] = React.useState(null);

    const handlePureWaterClick = () => {
        setIsPureWater(true);
        const pureWaterState = getInitialFormData();
        Object.keys(pureWaterState.elements).forEach(key => {
            pureWaterState.elements[key].value = '0';
        });
        pureWaterState.ec = '0';
        setFormData(pureWaterState);
    };

    const handleCreateNew = () => {
        setIsPureWater(false);
        setSelectedProfileId('');
        setFormData(getInitialFormData());
    };

    const handleElementChange = React.useCallback((id, value, field) => {
        setFormData(prev => ({
            ...prev,
            elements: { ...prev.elements, [id]: { ...prev.elements[id], [field]: value } }
        }));
    }, []);

    const handleLoadProfile = () => {
        const profile = profiles.find(p => p.id === parseInt(selectedProfileId));
        if (profile) {
            const newFormData = getInitialFormData();
            newFormData.analysisName = profile.name;
            newFormData.ec = profile.data.ec || '';
            newFormData.ecUnit = profile.data.ecUnit || 'dS/m';
            newFormData.ph = profile.data.ph || '';
            if (profile.data.elements) {
                Object.keys(profile.data.elements).forEach(elId => {
                    if (newFormData.elements[elId]) {
                        newFormData.elements[elId] = {
                            ...newFormData.elements[elId], // keep default 'form'
                            ...profile.data.elements[elId],
                        };
                    }
                });
            }
            setFormData(newFormData);
            setIsPureWater(false);
        }
    };
    
    const handleSaveProfile = () => {
        const newProfile = {
            id: Date.now(),
            name: formData.analysisName || `Analysis ${Date.now()}`,
            data: {
                ec: formData.ec,
                ecUnit: formData.ecUnit,
                ph: formData.ph,
                elements: formData.elements,
            },
        };
        setProfiles(prev => [...prev, newProfile]);
        alert(`Profile '${newProfile.name}' saved!`);
    };

    const handleDeleteProfile = () => {
        setProfiles(prev => prev.filter(p => p.id !== parseInt(selectedProfileId)));
        handleCreateNew();
    };

    const handleValidation = () => {
        const balance = calculateIonicBalance(formData.elements, elementsData);
        if (balance.anions > 0 && Math.abs(balance.differencePercentage) > 10) {
            setIonicBalanceWarning(`Warning: Ionic balance is off by ${balance.differencePercentage.toFixed(2)}%. Sum of Cations: ${balance.cations.toFixed(2)} meq/L, Sum of Anions: ${balance.anions.toFixed(2)} meq/L.`);
        } else {
            setIonicBalanceWarning(null);
        }
        return true; // Non-blocking
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const finalDataInMmol = {};
            Object.entries(formData.elements).forEach(([id, data]) => {
                const element = elementsData.find(el => el.id === id);
                if (data.value && element) {
                     const selectedForm = element.forms?.find(f => f.name === data.form);
                     const molarMass = selectedForm ? selectedForm.molar_mass : element.molar_mass_g_mol;
                    finalDataInMmol[id] = convertToMmol({ value: data.value, unit: data.unit, molarMass, valence: element.valence });
                }
            });
            console.log("Final data (in mM/L):", finalDataInMmol);
            alert("Analysis validated. Check console for final data (all in mM/L).");
            // FIX: The onNext call was commented out, preventing navigation after form submission. This has been enabled.
            if (onNext) onNext(finalDataInMmol);
        }
    };


    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Water Analysis (Step 2)</h1>
                    <p className="text-sm text-gray-600 mb-6">Enter the chemical composition of your source water.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* Zone 1: Profile Management */}
                    <fieldset className="mb-8 p-4 border rounded-lg">
                        <legend className="font-semibold text-lg px-2">Manage Water Profiles</legend>
                        <div className="flex flex-wrap items-center gap-4">
                            <select value={selectedProfileId} onChange={e => setSelectedProfileId(e.target.value)} className="p-2 border rounded-md min-w-[200px]">
                                <option value="">Select a profile...</option>
                                {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <button type="button" onClick={handleLoadProfile} disabled={!selectedProfileId} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">Load</button>
                            <button type="button" onClick={handleDeleteProfile} disabled={!selectedProfileId} className="px-4 py-2 bg-red-600 text-white rounded-md disabled:bg-gray-400">Delete</button>
                            <button type="button" onClick={handleCreateNew} className="px-4 py-2 bg-green-600 text-white rounded-md">Create New Analysis</button>
                        </div>
                    </fieldset>

                    {/* Zone 2: Quick Case */}
                    <div className="mb-8">
                        <button type="button" onClick={handlePureWaterClick} className="w-full py-3 bg-indigo-100 text-indigo-800 font-semibold rounded-lg hover:bg-indigo-200 transition-colors">
                            Use Pure Water / Osmosis Water (Fill all with 0)
                        </button>
                    </div>

                    {/* Zone 3: Analysis Table */}
                    <fieldset>
                        <legend className="font-semibold text-lg mb-4">Analysis Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-gray-700">EC</label>
                                    <input type="number" value={formData.ec} onChange={e => setFormData(p => ({ ...p, ec: e.target.value }))} className="mt-1 w-full p-2 border rounded-md" disabled={isPureWater} />
                                </div>
                                <select value={formData.ecUnit} onChange={e => setFormData(p => ({ ...p, ecUnit: e.target.value }))} className="p-2 border rounded-md" disabled={isPureWater}>
                                    <option value="µS/cm">µS/cm</option>
                                    <option value="dS/m">dS/m</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">pH</label>
                                <input type="number" value={formData.ph} onChange={e => setFormData(p => ({ ...p, ph: e.target.value }))} className="mt-1 w-full p-2 border rounded-md" disabled={isPureWater} />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Element</th>
                                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Unit</th>
                                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Form</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementsData.map(element => (
                                        <ElementInputRow
                                            key={element.id}
                                            element={element}
                                            value={formData.elements[element.id].value}
                                            unit={formData.elements[element.id].unit}
                                            form={formData.elements[element.id].form}
                                            onValueChange={(id, val) => handleElementChange(id, val, 'value')}
                                            onUnitChange={(id, val) => handleElementChange(id, val, 'unit')}
                                            onFormChange={(id, val) => handleElementChange(id, val, 'form')}
                                            disabled={isPureWater}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </fieldset>

                    {ionicBalanceWarning && (
                        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800">
                            <p className="font-bold">Ionic Balance Check</p>
                            <p>{ionicBalanceWarning}</p>
                        </div>
                    )}
                    
                    <div className="mt-8 pt-5 border-t border-gray-200 space-y-4">
                         <div className="flex items-center gap-4">
                            <label htmlFor="analysisName" className="font-medium">Analysis Name:</label>
                            <input
                                id="analysisName"
                                type="text"
                                value={formData.analysisName}
                                onChange={e => setFormData(p => ({ ...p, analysisName: e.target.value }))}
                                placeholder="e.g., Puits Sud - Hiver 2025"
                                className="flex-grow p-2 border rounded-md"
                            />
                            <button type="button" onClick={handleSaveProfile} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700">Save Profile</button>
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={onBack} className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                &larr; Back
                            </button>
                            <button type="submit" className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                Validate and Continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <UnitConverterTool elements={elementsData} />
        </div>
    );
};

export default Step2_WaterAnalysis;