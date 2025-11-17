// data/elements.js
export const elements = [
  // Cations (positive charge)
  { id: 'Ca', name: 'Calcium', symbol: 'Ca', displayName: 'Ca', molar_mass_g_mol: 40.08, valence: 2, type: 'cation', category: 'macro' },
  { id: 'Mg', name: 'Magnesium', symbol: 'Mg', displayName: 'Mg', molar_mass_g_mol: 24.31, valence: 2, type: 'cation', category: 'macro' },
  { id: 'K', name: 'Potassium', symbol: 'K', displayName: 'K', molar_mass_g_mol: 39.10, valence: 1, type: 'cation', category: 'macro' },
  { id: 'Na', name: 'Sodium', symbol: 'Na', displayName: 'Na', molar_mass_g_mol: 22.99, valence: 1, type: 'cation', category: 'macro' },
  { id: 'NH4', name: 'Ammonium', symbol: 'NH₄⁺', displayName: 'N-NH4', molar_mass_g_mol: 18.04, valence: 1, type: 'cation', category: 'macro' },
  
  // Anions (negative charge)
  { id: 'NO3', name: 'Nitrate', symbol: 'NO₃⁻', displayName: 'N-NO3', molar_mass_g_mol: 62.00, valence: -1, type: 'anion', category: 'macro' },
  { 
    id: 'P', 
    name: 'Phosphore', 
    symbol: 'P', 
    displayName: 'P-PO4',
    molar_mass_g_mol: 30.97, 
    valence: -1, // Valence for H₂PO₄⁻ form
    type: 'anion',
    category: 'macro',
    is_ambiguous: true,
    forms: [
      { name: 'H₂PO₄⁻', molar_mass: 96.987 },
      { name: 'P', molar_mass: 30.97 },
    ]
  },
  { 
    id: 'S', 
    name: 'Soufre', 
    symbol: 'S', 
    displayName: 'S-SO4',
    molar_mass_g_mol: 32.07, 
    valence: -2, // Valence for SO₄²⁻ form
    type: 'anion',
    category: 'macro',
    is_ambiguous: true,
    forms: [
      { name: 'SO₄²⁻', molar_mass: 96.07 },
      { name: 'S', molar_mass: 32.07 },
    ]
  },
  { id: 'Cl', name: 'Chloride', symbol: 'Cl⁻', displayName: 'Cl', molar_mass_g_mol: 35.45, valence: -1, type: 'anion', category: 'macro' },
  { id: 'HCO3', name: 'Bicarbonate', symbol: 'HCO₃⁻', displayName: 'HCO3', molar_mass_g_mol: 61.02, valence: -1, type: 'anion', category: 'macro' },
  
  // Micronutrients
  { id: 'Fe', name: 'Iron', symbol: 'Fe', displayName: 'Fe', molar_mass_g_mol: 55.85, valence: 2, type: 'cation', category: 'micro' },
  { id: 'Mn', name: 'Manganese', symbol: 'Mn', displayName: 'Mn', molar_mass_g_mol: 54.94, valence: 2, type: 'cation', category: 'micro' },
  { id: 'B', name: 'Boron', symbol: 'B', displayName: 'B', molar_mass_g_mol: 10.81, valence: 0, type: 'anion', category: 'micro' },
  { id: 'Cu', name: 'Copper', symbol: 'Cu', displayName: 'Cu', molar_mass_g_mol: 63.55, valence: 2, type: 'cation', category: 'micro' },
  { id: 'Zn', name: 'Zinc', symbol: 'Zn', displayName: 'Zn', molar_mass_g_mol: 65.38, valence: 2, type: 'cation', category: 'micro' },
  { id: 'Mo', name: 'Molybdenum', symbol: 'Mo', displayName: 'Mo', molar_mass_g_mol: 95.96, valence: -2, type: 'anion', category: 'micro' },
];