// data/fertilizers.js
export const fertilizersList = [
    // Acides
    { id: 1, name: 'Acide Nitrique 58%', category: 'Acids', isSystem: true, composition: { 'N_NO3': 13.5 }, type: 'Liquid/Acid', density: 1.36, purity: 58 },
    { id: 2, name: 'Acide Phosphorique 75%', category: 'Acids', isSystem: true, composition: { 'P': 32.7 }, type: 'Liquid/Acid', density: 1.57, purity: 75 },
    { id: 3, name: 'Acide Sulfurique 96%', category: 'Acids', isSystem: true, composition: { 'S': 32.0 }, type: 'Liquid/Acid', density: 1.84, purity: 96 },

    // Engrais de Calcium
    { id: 4, name: 'Nitrate de Calcium', category: 'Calcium Fertilizers', isSystem: true, composition: { 'N_NO3': 15.5, 'Ca': 19.0 } },
    { id: 5, name: 'Sulfate de Calcium (Gypse)', category: 'Calcium Fertilizers', isSystem: true, composition: { 'Ca': 23.2, 'S': 18.6 } },
    { id: 6, name: 'Chélate de Calcium EDTA', category: 'Calcium Fertilizers', isSystem: true, composition: { 'Ca': 10.0 } },

    // Engrais de Potassium
    { id: 7, name: 'Nitrate de Potassium', category: 'Potassium Fertilizers', isSystem: true, composition: { 'N_NO3': 13.7, 'K': 38.6 } },
    { id: 8, name: 'Sulfate de Potassium', category: 'Potassium Fertilizers', isSystem: true, composition: { 'K': 44.8, 'S': 18.4 } },
    { id: 9, name: 'Phosphate Monopotassique (MKP)', category: 'Potassium Fertilizers', isSystem: true, composition: { 'P': 22.7, 'K': 28.7 } },
    { id: 10, name: 'Chlorure de Potassium', category: 'Potassium Fertilizers', isSystem: true, composition: { 'K': 52.0 } },

    // Engrais de Magnésium
    { id: 11, name: 'Nitrate de Magnésium', category: 'Magnesium Fertilizers', isSystem: true, composition: { 'N_NO3': 11.0, 'Mg': 9.6 } },
    { id: 12, name: 'Sulfate de Magnésium (Epsom)', category: 'Magnesium Fertilizers', isSystem: true, composition: { 'Mg': 9.8, 'S': 13.0 } },

    // Engrais Phosphatés
    { id: 13, name: 'Phosphate Monoammonique (MAP)', category: 'Phosphate Fertilizers', isSystem: true, composition: { 'N_NH4': 12.0, 'P': 26.6 } },

    // Oligo-éléments
    { id: 14, name: 'Sulfate de Fer', category: 'Micronutrients', isSystem: true, composition: { 'Fe': 20.0, 'S': 11.5 } },
    { id: 15, name: 'Fer Chélate EDDHA', category: 'Micronutrients', isSystem: true, composition: { 'Fe': 6.0 } },
    { id: 16, name: 'Sulfate de Manganèse', category: 'Micronutrients', isSystem: true, composition: { 'Mn': 32.0, 'S': 18.0 } },
    { id: 17, name: 'Sulfate de Zinc', category: 'Micronutrients', isSystem: true, composition: { 'Zn': 22.0, 'S': 11.0 } },
    { id: 18, name: 'Sulfate de Cuivre', category: 'Micronutrients', isSystem: true, composition: { 'Cu': 25.0, 'S': 12.0 } },
    { id: 19, name: 'Acide Borique', category: 'Micronutrients', isSystem: true, composition: { 'B': 17.0 } },
    { id: 20, name: 'Molybdate de Sodium', category: 'Micronutrients', isSystem: true, composition: { 'Mo': 39.0 } },
];
