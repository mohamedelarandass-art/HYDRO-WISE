import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { themes } from '../data/themes';

const ThemeSwitcher: React.FC = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        // This should not happen as the component is used within the provider
        return null;
    }

    const { themeName, setThemeName } = context;

    return (
        <div className="flex items-center space-x-2 p-1 bg-brand-secondary rounded-full">
            {Object.keys(themes).map((name) => (
                <button
                    key={name}
                    onClick={() => setThemeName(name)}
                    className={`w-6 h-6 rounded-full transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary`}
                    style={{ backgroundColor: themes[name].palette['--color-primary'] }}
                    aria-label={`Switch to ${name} theme`}
                >
                    {themeName === name && (
                        <span className="block w-full h-full rounded-full ring-2 ring-offset-2 ring-offset-brand-secondary ring-brand-text-light"></span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
