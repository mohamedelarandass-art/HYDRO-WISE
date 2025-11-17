import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import Step1_InitialConfig from './components/Step1_InitialConfig';
import Step2_WaterAnalysis from './components/Step2_WaterAnalysis';
import Step3_TargetRecipe from './components/Step3_TargetRecipe';
import Step4_FertilizerSelection from './components/Step4_FertilizerSelection';
import Step5_CalculationEngine from './components/Step5_CalculationEngine';
import Step6_ResultsReport from './components/Step6_ResultsReport'; // Import Step 6
import { ThemeProvider } from './context/ThemeContext';
import { recipeTemplates } from './data/recipes';
import { fertilizersList as initialFertilizers } from './data/fertilizers';
import { elements as elementsData } from './data/elements.js';


function App() {
  const [currentStep, setCurrentStep] = useState('landing'); // 'landing', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6'
  const [initialConfigData, setInitialConfigData] = useState(null);
  const [waterAnalysisData, setWaterAnalysisData] = useState(null);
  const [recipeData, setRecipeData] = useState(null);
  const [fertilizerSelectionData, setFertilizerSelectionData] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);

  const navigateToStep1 = () => setCurrentStep('step1');
  const navigateToStep2 = () => setCurrentStep('step2');
  const navigateToStep3 = () => setCurrentStep('step3');
  const navigateToStep4 = () => setCurrentStep('step4');
  const navigateToStep5 = () => setCurrentStep('step5');

  const navigateBackToStep1 = () => setCurrentStep('step1');
  const navigateBackToStep2 = () => setCurrentStep('step2');
  const navigateBackToStep3 = () => setCurrentStep('step3');
  const navigateBackToStep4 = () => setCurrentStep('step4');
  
  const handleConfigComplete = (data) => {
    console.log('Config data received:', data);
    setInitialConfigData(data);
    navigateToStep2();
  };

  const handleAnalysisComplete = (data) => {
    console.log('Analysis data received:', data);
    setWaterAnalysisData(data);
    navigateToStep3();
  };

  const handleRecipeComplete = (data) => {
    console.log('Recipe data received:', data);
    setRecipeData(data);
    navigateToStep4();
  };

  const handleFertilizerSelectionComplete = (data) => {
    console.log('Fertilizer selection complete:', data);
    setFertilizerSelectionData(data);
    navigateToStep5();
  };

  const generateMockResults = () => {
    const getEl = (id) => elementsData.find(el => el.id === id);
    const finalComposition = Object.keys(recipeData.targets_mM).map(elId => {
      const water = waterAnalysisData[elId] || 0;
      const target = recipeData.targets_mM[elId];
      const final = target * (1 + (Math.random() - 0.5) * 0.05); // +/- 2.5% deviation
      const diff = target > 0 ? ((final - target) / target) * 100 : 0;
      const elData = getEl(elId);
      const isMicro = elData.category === 'micro';
      return {
        element: elData.displayName,
        unit: isMicro ? 'µM/L' : 'mM/L',
        fromWater: isMicro ? water * 1000 : water,
        target: isMicro ? target * 1000 : target,
        final: isMicro ? final * 1000 : final,
        diff: isNaN(diff) ? 0 : diff,
      };
    });

    return {
      context: {
        calculationName: initialConfigData.calculationName,
        crop: initialConfigData.crop,
        stage: initialConfigData.cropStage,
        dilutionRatio: `${initialConfigData.dilutionRatio1}:${initialConfigData.dilutionRatio2}`,
        tankConfiguration: initialConfigData.tanks.map(t => `${t.label} (${t.volume}L)`).join(', '),
      },
      tanks: initialConfigData.tanks.map(tank => ({
        name: tank.label,
        volume: tank.volume,
        recipe: [
          { product: 'Nitrate de Calcium', quantity: '30.78 Kg' },
          { product: 'Acide Nitrique 58%', quantity: '5.12 L' },
          { product: 'Fer Chélate EDDHA', quantity: '1.20 Kg' },
        ]
      })),
      finalComposition,
      ionicRatios: [
        { ratio: 'N/K', target: 1.71, final: 1.70 },
        { ratio: 'K/Ca', target: 1.56, final: 1.55 },
        { ratio: 'Ca/Mg', target: 2.25, final: 2.28 },
      ],
      costs: {
        totalStockCost: '1543.25 MAD',
        costPerM3: '1.54 MAD'
      },
      reportId: `session_${Date.now()}`
    };
  };

  const handleCalculationComplete = () => {
      console.log('Calculation successful, generating report data...');
      // In a real app, `data` would come from the API. Here we generate mock data.
      if (initialConfigData && waterAnalysisData && recipeData) {
          const results = generateMockResults();
          setCalculationResult(results);
          setCurrentStep('step6');
      } else {
          console.error("Missing data from previous steps, cannot generate report.");
          alert("Error: Data from previous steps is missing.");
          setCurrentStep('step1'); // Go back to the start
      }
  };

  const handleModifyParameters = () => {
    // Reset all data and go back to step 1
    setInitialConfigData(null);
    setWaterAnalysisData(null);
    setRecipeData(null);
    setFertilizerSelectionData(null);
    setCalculationResult(null);
    setCurrentStep('step1');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'step1':
        return <Step1_InitialConfig onNext={handleConfigComplete} />;
      case 'step2':
        return <Step2_WaterAnalysis onBack={navigateBackToStep1} onNext={handleAnalysisComplete} />;
      case 'step3':
        return <Step3_TargetRecipe 
                  waterAnalysisData={waterAnalysisData} 
                  recipeTemplates={recipeTemplates}
                  onBack={navigateBackToStep2} 
                  onNext={handleRecipeComplete} 
                />;
      case 'step4':
        return <Step4_FertilizerSelection
                  fertilizersList={initialFertilizers}
                  userDefaultInventoryIds={[1, 5, 8, 12, 14, 16]} // Example IDs
                  currencySymbol="MAD"
                  onBack={navigateBackToStep3}
                  onNext={handleFertilizerSelectionComplete}
                />;
      case 'step5':
        return <Step5_CalculationEngine
                  initialConfigData={initialConfigData}
                  waterAnalysisData={waterAnalysisData}
                  targetRecipeData={recipeData}
                  fertilizerSelectionData={fertilizerSelectionData}
                  onBack={navigateBackToStep4}
                  onNext={handleCalculationComplete}
                />;
      case 'step6':
        return (
            <Step6_ResultsReport 
              calculationResults={calculationResult}
              onModifyParameters={handleModifyParameters}
            />
        );
      case 'landing':
      default:
        return (
          <div className="bg-brand-text-light text-brand-text-dark">
            <Header onNavigate={navigateToStep1} />
            <main>
              <Hero onNavigate={navigateToStep1} />
              <HowItWorks />
              <WhyChooseUs onNavigate={navigateToStep1} />
            </main>
            <Footer />
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
