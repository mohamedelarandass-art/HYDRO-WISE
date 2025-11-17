// data/recipes.js

export const recipeTemplates = [
  {
    id: 'system1',
    name: 'Tomato - Fruiting Stage (WISE DRIP Standard)',
    isSystemRecipe: true,
    targets: { // All values in mM/L
      'NO3': 12.0,
      'NH4': 1.2,
      'P': 1.5,
      'K': 7.0,
      'Ca': 4.5,
      'Mg': 2.0,
      'S': 2.5,
      // Micros in mM/L (will be displayed as µM/L)
      'Fe': 0.02,     // 20 µM/L
      'Mn': 0.01,     // 10 µM/L
      'Zn': 0.005,    // 5 µM/L
      'B': 0.025,     // 25 µM/L
      'Cu': 0.002,    // 2 µM/L
      'Mo': 0.0005,   // 0.5 µM/L
    },
  },
  {
    id: 'system2',
    name: 'Cucumber - Vegetative (WISE DRIP Standard)',
    isSystemRecipe: true,
    targets: {
      'NO3': 14.0,
      'NH4': 1.0,
      'P': 1.2,
      'K': 6.0,
      'Ca': 5.0,
      'Mg': 2.2,
      'S': 2.0,
      'Fe': 0.022,
      'Mn': 0.011,
      'Zn': 0.006,
      'B': 0.030,
      'Cu': 0.002,
      'Mo': 0.0005,
    },
  },
  {
    id: 'user1',
    name: 'My Custom Strawberry Recipe v1',
    isSystemRecipe: false,
    targets: {
      'NO3': 8.0,
      'NH4': 0.8,
      'P': 1.0,
      'K': 5.0,
      'Ca': 3.5,
      'Mg': 1.5,
      'S': 1.8,
      'Fe': 0.018,
      'Mn': 0.009,
      'Zn': 0.004,
      'B': 0.020,
      'Cu': 0.0015,
      'Mo': 0.0004,
    },
  }
];