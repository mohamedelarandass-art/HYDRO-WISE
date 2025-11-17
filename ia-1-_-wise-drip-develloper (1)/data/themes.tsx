export interface Theme {
  palette: {
    '--color-primary': string;
    '--color-secondary': string;
    '--color-accent': string;
    '--color-text-dark': string;
    '--color-text-light': string;
  };
  image: string;
}

export const themes: Record<string, Theme> = {
  blueberry: {
    palette: {
      '--color-primary': '#3A5A9A',
      '--color-secondary': '#D1D8E0',
      '--color-accent': '#B3D3B5',
      '--color-text-dark': '#2C3A47',
      '--color-text-light': '#F5F7FA',
    },
    image: 'https://placehold.co/1920x1080/3A5A9A/F5F7FA?text=Blueberry+Theme'
  },
  strawberry: {
    palette: {
      '--color-primary': '#D93A4D',
      '--color-secondary': '#F4E9CD',
      '--color-accent': '#4A785A',
      '--color-text-dark': '#3B2C2C',
      '--color-text-light': '#FEFDFB',
    },
    image: 'https://placehold.co/1920x1080/D93A4D/FEFDFB?text=Strawberry+Theme'
  },
  raspberry: {
    palette: {
      '--color-primary': '#C54B8C',
      '--color-secondary': '#F8F0E3',
      '--color-accent': '#F9A602',
      '--color-text-dark': '#4A2C40',
      '--color-text-light': '#FCFAFD',
    },
    image: 'https://placehold.co/1920x1080/C54B8C/FCFAFD?text=Raspberry+Theme'
  },
  blackberry: {
    palette: {
      '--color-primary': '#343148',
      '--color-secondary': '#D7D7D7',
      '--color-accent': '#78CAD2',
      '--color-text-dark': '#1A1A1A',
      '--color-text-light': '#ECEEEE',
    },
    image: 'https://placehold.co/1920x1080/343148/ECEEEE?text=Blackberry+Theme'
  }
};
