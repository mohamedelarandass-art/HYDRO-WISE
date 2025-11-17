// Step1_InitialConfig.jsx
import React from 'react';
import Tooltip from './Tooltip';
import InfoIcon from './icons/InfoIcon';

// Reusable InputField component
const InputField = ({ id, name, label, value, onChange, type = 'text', error, placeholder, required = false, srOnlyLabel = false, ...props }) => (
    <div>
        <label htmlFor={id} className={`${srOnlyLabel ? 'sr-only' : 'block text-sm font-medium text-gray-700'}`}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500 text-red-900' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            {...props}
        />
        {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

// Reusable SelectField component for dropdowns
const SelectField = ({ id, name, label, value, onChange, error, required = false, options, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${error ? 'border-red-500 text-red-900' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
            {...props}
        >
            <option value="" disabled>-- Please select --</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
        {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);


const CROP_OPTIONS = [
    { value: 'tomato', label: 'Tomato' },
    { value: 'cucumber', label: 'Cucumber' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'pepper', label: 'Pepper' },
];

const CROP_STAGE_OPTIONS = [
    { value: 'germination', label: 'Germination' },
    { value: 'vegetative', label: 'Vegetative' },
    { value: 'flowering', label: 'Flowering' },
    { value: 'fruiting', label: 'Fruiting' },
];

const initialFormData = {
    calculationName: '',
    crop: '',
    cropStage: '',
    targetEC: '',
    targetPH: '',
    dilutionRatio1: '1',
    dilutionRatio2: '150',
};

const Step1_InitialConfig = ({ onNext }) => {
    const [formData, setFormData] = React.useState(initialFormData);
    const [numberOfTanks, setNumberOfTanks] = React.useState(2);
    const [tanks, setTanks] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const nextId = React.useRef(1);

    const getInitialTanks = (count) => {
        return Array.from({ length: count }, () => ({
            id: nextId.current++,
            label: '',
            volume: '1000'
        }));
    };

    // Initialize tanks on component mount
    React.useEffect(() => {
        setTanks(getInitialTanks(2));
    }, []);


    React.useEffect(() => {
        setTanks(currentTanks => {
            const newTanks = [...currentTanks];
            const difference = numberOfTanks - newTanks.length;

            if (difference > 0) {
                for (let i = 0; i < difference; i++) {
                    newTanks.push({ id: nextId.current++, label: '', volume: '1000' });
                }
            } else if (difference < 0) {
                newTanks.splice(numberOfTanks);
            }
            return newTanks;
        });
    }, [numberOfTanks]);

    const handleInputChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);
    
    const handleNumberOfTanksChange = React.useCallback((e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) {
            value = 1;
        }
        setNumberOfTanks(value);
    }, []);

    const handleTankChange = React.useCallback((e) => {
        const { name, value } = e.target;
        const index = parseInt(e.target.dataset.index, 10);
        setTanks(prevTanks => 
            prevTanks.map((tank, i) => 
                i === index ? { ...tank, [name]: value } : tank
            )
        );
    }, []);
    
    const getSmartTankLabel = React.useCallback((index, totalTanks) => {
        if (totalTanks === 2) {
            return `Fertilizer ${String.fromCharCode(65 + index)}`; // Fertilizer A, Fertilizer B
        }
        if (totalTanks === 3) {
            const labels = ['Fertilizer A', 'Fertilizer B', 'Acid'];
            return labels[index];
        }
        if (totalTanks >= 4) {
            const labels = ['Fertilizer A', 'Fertilizer B', 'Acid', 'Micronutrients'];
            if (index < labels.length) {
                return labels[index];
            }
        }
        // Fallback for 1 tank or more than 4 tanks
        return `Tank ${String.fromCharCode(65 + index)}`;
    }, []);

    const validate = React.useCallback(() => {
        const newErrors = {};
        
        if (!formData.calculationName.trim()) newErrors.calculationName = 'Calculation name is required.';
        if (!formData.crop) newErrors.crop = 'Crop is required.';
        if (!formData.cropStage) newErrors.cropStage = 'Crop stage is required.';

        if (!formData.targetEC) newErrors.targetEC = 'Target EC is required.';
        else if (isNaN(formData.targetEC) || Number(formData.targetEC) <= 0) {
            newErrors.targetEC = 'Target EC must be a positive number.';
        }
        
        if (!formData.targetPH) newErrors.targetPH = 'Target pH is required.';
        else if (isNaN(formData.targetPH) || Number(formData.targetPH) <= 0) {
            newErrors.targetPH = 'Target pH must be a positive number.';
        } else if (Number(formData.targetPH) < 3 || Number(formData.targetPH) > 9) {
            newErrors.targetPH = 'Target pH must be between 3 and 9.';
        }
        
        if (!formData.dilutionRatio1 || isNaN(formData.dilutionRatio1) || Number(formData.dilutionRatio1) <= 0) {
            newErrors.dilutionRatio1 = 'Must be a positive number.';
        }
        if (!formData.dilutionRatio2 || isNaN(formData.dilutionRatio2) || Number(formData.dilutionRatio2) <= 0) {
            newErrors.dilutionRatio2 = 'Must be a positive number.';
        }

        const tankErrors = [];
        tanks.forEach((tank, index) => {
            const currentTankErrors = {};
            if (!tank.volume || String(tank.volume).trim() === '') {
                currentTankErrors.volume = 'Volume is required.';
            } else if (isNaN(tank.volume) || Number(tank.volume) <= 0) {
                currentTankErrors.volume = 'Volume must be a positive number.';
            }
            if (Object.keys(currentTankErrors).length > 0) {
                tankErrors[index] = currentTankErrors;
            }
        });

        if (tankErrors.length > 0) {
            newErrors.tanks = tankErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && (!newErrors.tanks || newErrors.tanks.length === 0);
    }, [formData, tanks]);
    
    const handleClearForm = React.useCallback(() => {
        setFormData(initialFormData);
        setNumberOfTanks(2);
        setTanks(getInitialTanks(2));
        setErrors({});
    }, []);
    
    const proceedToNextStep = React.useCallback(() => {
         if (validate()) {
            const submissionData = {
                ...formData,
                tanks: tanks.map((tank, index) => ({
                    ...tank,
                    label: tank.label.trim() || getSmartTankLabel(index, tanks.length),
                })),
            };
            if(onNext) onNext(submissionData);
        } else {
            console.log('Validation failed, staying on the current step.');
        }
    }, [validate, onNext, formData, tanks, getSmartTankLabel]);


    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        proceedToNextStep();
    }, [proceedToNextStep]);
    
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Initial Configuration (Step 1)</h1>
                    <p className="text-sm text-gray-600 mb-6">Define the core parameters for your fertigation calculation.</p>
                </header>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-6">
                        <fieldset className="border-t border-gray-200 pt-6">
                            <legend className="text-lg font-semibold text-gray-800">Calculation Details</legend>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <InputField id="calculationName" name="calculationName" label="Calculation Name" value={formData.calculationName} onChange={handleInputChange} error={errors.calculationName} placeholder="Tomates Corrina - Croissance S5" required={true}/>
                                <SelectField id="crop" name="crop" label="Crop" value={formData.crop} onChange={handleInputChange} error={errors.crop} required={true} options={CROP_OPTIONS} />
                             </div>
                             <div className="mt-6">
                                <SelectField id="cropStage" name="cropStage" label="Crop Stage" value={formData.cropStage} onChange={handleInputChange} error={errors.cropStage} required={true} options={CROP_STAGE_OPTIONS} />
                             </div>
                        </fieldset>

                        <fieldset className="border-t border-gray-200 pt-6">
                             <legend className="text-lg font-semibold text-gray-800">Agronomic Targets</legend>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <div className="flex items-center space-x-1.5 mb-1">
                                        <label htmlFor="targetEC" className="text-sm font-medium text-gray-700">Target EC (dS/m) <span className="text-red-500">*</span></label>
                                        <Tooltip text="Electrical Conductivity (EC) is a measure of the total dissolved salts in your nutrient solution.">
                                            <InfoIcon />
                                        </Tooltip>
                                    </div>
                                    <InputField id="targetEC" name="targetEC" label="Target EC (dS/m)" value={formData.targetEC} onChange={handleInputChange} type="number" error={errors.targetEC} placeholder="1.35" required={true} srOnlyLabel={true}/>
                                </div>
                                <div>
                                     <div className="flex items-center space-x-1.5 mb-1">
                                        <label htmlFor="targetPH" className="text-sm font-medium text-gray-700">Target pH <span className="text-red-500">*</span></label>
                                        <Tooltip text="pH measures the acidity or alkalinity of the solution, affecting nutrient availability.">
                                            <InfoIcon />
                                        </Tooltip>
                                    </div>
                                    <InputField id="targetPH" name="targetPH" label="Target pH" value={formData.targetPH} onChange={handleInputChange} type="number" error={errors.targetPH} placeholder="5.80" required={true} srOnlyLabel={true}/>
                                </div>
                             </div>
                        </fieldset>

                        <fieldset className="border-t border-gray-200 pt-6">
                            <legend className="text-lg font-semibold text-gray-800">System Parameters</legend>
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                                <p className="font-medium text-gray-700">There are 4 possible combinations:</p>
                                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-500">
                                    <li>1 tank of commercial solution + 1 acid tank.</li>
                                    <li>2 fertilizer tanks (A + B), with one containing all the necessary quantity to correct the final solution's pH.</li>
                                    <li>3 tanks: 2 fertilizer tanks (A + B) and 1 tank containing all the necessary quantity to correct the final solution's pH.</li>
                                    <li>Multiple tanks containing ultra-pure, concentrated simple solutions for computer-controlled recipes.</li>
                                </ul>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <div className="flex items-center space-x-1.5 mb-1">
                                        <label className="text-sm font-medium text-gray-700">Dilution Ratio <span className="text-red-500">*</span></label>
                                        <Tooltip text="The ratio of stock solution to water (e.g., 1 part stock for 150 parts water).">
                                            <InfoIcon />
                                        </Tooltip>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <InputField id="dilutionRatio1" name="dilutionRatio1" label="Ratio Part 1" value={formData.dilutionRatio1} onChange={handleInputChange} type="number" error={errors.dilutionRatio1} srOnlyLabel={true} />
                                        <span className="text-gray-500 pt-5">for</span>
                                        <InputField id="dilutionRatio2" name="dilutionRatio2" label="Ratio Part 2" value={formData.dilutionRatio2} onChange={handleInputChange} type="number" error={errors.dilutionRatio2} srOnlyLabel={true} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1.5 mb-1">
                                        <label htmlFor="numberOfTanks" className="text-sm font-medium text-gray-700">Number of stock solution tanks <span className="text-red-500">*</span></label>
                                         <Tooltip text="The number of separate tanks (A, B, Acid, etc.) your system uses.">
                                            <InfoIcon />
                                        </Tooltip>
                                    </div>
                                    <InputField id="numberOfTanks" name="numberOfTanks" label="Number of stock solution tanks" value={numberOfTanks} onChange={handleNumberOfTanksChange} type="number" required={true} srOnlyLabel={true}/>
                                </div>
                             </div>
                        </fieldset>
                        
                        {tanks.length > 0 && (
                             <fieldset className="border-t border-gray-200 pt-6">
                                <legend className="text-lg font-semibold text-gray-800">Tank Configuration</legend>
                                <div className="space-y-4 mt-4">
                                {tanks.map((tank, index) => (
                                    <div key={tank.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start p-4 border border-gray-200 rounded-lg">
                                        <div className="md:col-span-1 pt-2">
                                            <span className="font-semibold text-gray-700">Tank {String.fromCharCode(65 + index)}</span>
                                        </div>
                                        <div className="md:col-span-2">
                                             <InputField id={`tank-label-${tank.id}`} name="label" label="Tank Label (Optional)" value={tank.label} onChange={handleTankChange} placeholder={`e.g., ${getSmartTankLabel(index, tanks.length)}`} data-index={index}/>
                                        </div>
                                        <div className="md:col-span-2">
                                             <InputField id={`tank-volume-${tank.id}`} name="volume" label="Volume (L)" value={tank.volume} onChange={handleTankChange} type="number" error={errors.tanks?.[index]?.volume} required={true} data-index={index}/>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </fieldset>
                        )}
                    </div>

                    <div className="mt-8 pt-5 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                             <button type="button" onClick={handleClearForm} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Clear Form
                            </button>
                            <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Save and Continue
                            </button>
                        </div>
                        <div className="mt-4 flex justify-end">
                             <button type="button" onClick={proceedToNextStep} className="py-2 px-6 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Step1_InitialConfig;