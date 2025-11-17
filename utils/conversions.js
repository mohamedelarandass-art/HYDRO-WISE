// utils/conversions.js

/**
 * Converts any input unit (ppm, mM/L, meq/L) to the base unit mM/L.
 * @param {object} args
 * @param {number|string} args.value The numerical value to convert.
 * @param {'ppm' | 'mM/L' | 'meq/L'} args.unit The starting unit.
 * @param {number} args.molarMass Molar mass in g/mol of the element/ion form.
 * @param {number} args.valence The absolute valence (charge) of the ion.
 * @returns {number} The value in mM/L.
 */
export const convertToMmol = ({ value, unit, molarMass, valence }) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || !molarMass) return 0;

    switch (unit) {
        case 'ppm':
            return numericValue / molarMass;
        case 'mM/L':
            return numericValue;
        case 'meq/L':
            return Math.abs(valence) ? numericValue / Math.abs(valence) : 0;
        default:
            return 0;
    }
};

/**
 * Converts a value from the base unit mM/L to a target unit.
 * @param {object} args
 * @param {number} args.value The numerical value in mM/L.
 * @param {'ppm' | 'mM/L' | 'meq/L'} args.unit The target unit.
 * @param {number} args.molarMass Molar mass in g/mol of the element/ion form.
 * @param {number} args.valence The absolute valence (charge) of the ion.
 * @returns {number} The value in the target unit.
 */
export const convertFromMmol = ({ value, unit, molarMass, valence }) => {
    if (isNaN(value) || !molarMass) return 0;

    switch (unit) {
        case 'ppm':
            return value * molarMass;
        case 'mM/L':
            return value;
        case 'meq/L':
            return value * Math.abs(valence);
        default:
            return 0;
    }
};

/**
 * Calculates the ionic balance from a form's element data.
 * @param {object} formElements The 'elements' object from the form state.
 * @param {Array<object>} elementsData The static data for all elements.
 * @returns {{cations: number, anions: number, differencePercentage: number}}
 */
export const calculateIonicBalance = (formElements, elementsData) => {
    let totalCations_meqL = 0;
    let totalAnions_meqL = 0;

    Object.entries(formElements).forEach(([id, data]) => {
        if (!data.value) return;

        const element = elementsData.find(el => el.id === id);
        if (!element || !element.type) return;
        
        const selectedForm = element.forms?.find(f => f.name === data.form);
        const molarMass = selectedForm ? selectedForm.molar_mass : element.molar_mass_g_mol;
        
        const valueInMmol = convertToMmol({
            value: data.value,
            unit: data.unit,
            molarMass,
            valence: element.valence,
        });

        const valueInMeql = convertFromMmol({
            value: valueInMmol,
            unit: 'meq/L',
            molarMass,
            valence: element.valence,
        });

        if (element.type === 'cation') {
            totalCations_meqL += valueInMeql;
        } else if (element.type === 'anion') {
            totalAnions_meqL += valueInMeql;
        }
    });

    const difference = totalCations_meqL - totalAnions_meqL;
    const sum = totalCations_meqL + totalAnions_meqL;
    const differencePercentage = sum > 0 ? (difference / (sum / 2)) * 100 : 0;

    return {
        cations: totalCations_meqL,
        anions: totalAnions_meqL,
        differencePercentage,
    };
};
