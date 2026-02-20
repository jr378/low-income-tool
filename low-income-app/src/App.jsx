import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import BenefitsScreener from './pages/BenefitsScreener';
import TaxScreener from './pages/TaxScreener';
import BenefitsResults from './pages/BenefitsResults';
import TaxResults from './pages/TaxResults';
import { checkAllBenefits } from './engine/eligibility';
import { checkAllTaxCredits } from './engine/taxEngine';

export default function App() {
  const [benefitsResults, setBenefitsResults] = useState(null);
  const [taxResults, setTaxResults] = useState(null);
  const [benefitsAnswers, setBenefitsAnswers] = useState(null);
  const [taxAnswers, setTaxAnswers] = useState(null);
  const [mode, setMode] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="pb-12 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route
            path="/screener/benefits"
            element={
              <BenefitsScreenerRoute
                setMode={setMode}
                setBenefitsResults={setBenefitsResults}
                setBenefitsAnswers={setBenefitsAnswers}
              />
            }
          />

          <Route
            path="/screener/tax"
            element={
              <TaxScreenerRoute
                setMode={setMode}
                setTaxResults={setTaxResults}
                setTaxAnswers={setTaxAnswers}
              />
            }
          />

          <Route
            path="/screener/both"
            element={
              <BothScreenerRoute
                mode={mode}
                setMode={setMode}
                benefitsAnswers={benefitsAnswers}
                setBenefitsResults={setBenefitsResults}
                setBenefitsAnswers={setBenefitsAnswers}
                setTaxResults={setTaxResults}
                setTaxAnswers={setTaxAnswers}
              />
            }
          />

          <Route
            path="/results/benefits"
            element={<BenefitsResults results={benefitsResults} answers={benefitsAnswers} />}
          />

          <Route
            path="/results/tax"
            element={<TaxResults results={taxResults} answers={taxAnswers} />}
          />

          <Route
            path="/results/both"
            element={
              <div>
                <BenefitsResults results={benefitsResults} answers={benefitsAnswers} />
                <div className="border-t border-gray-200 my-4" />
                <TaxResults results={taxResults} answers={taxAnswers} />
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function BenefitsScreenerRoute({ setMode, setBenefitsResults, setBenefitsAnswers }) {
  const navigate = useNavigate();

  const handleComplete = (answers) => {
    setMode('benefits');
    setBenefitsAnswers(answers);
    const results = checkAllBenefits(answers);
    setBenefitsResults(results);
    navigate('/results/benefits');
  };

  return <BenefitsScreener onComplete={handleComplete} />;
}

function TaxScreenerRoute({ setMode, setTaxResults, setTaxAnswers }) {
  const navigate = useNavigate();

  const handleComplete = (answers) => {
    setMode('tax');
    setTaxAnswers(answers);
    const results = checkAllTaxCredits(answers);
    setTaxResults(results);
    navigate('/results/tax');
  };

  return <TaxScreener onComplete={handleComplete} />;
}

function BothScreenerRoute({ mode, setMode, benefitsAnswers, setBenefitsResults, setBenefitsAnswers, setTaxResults, setTaxAnswers }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('benefits');

  const handleBenefitsComplete = (answers) => {
    setMode('both');
    setBenefitsAnswers(answers);
    const results = checkAllBenefits(answers);
    setBenefitsResults(results);
    setPhase('tax');
  };

  const handleTaxComplete = (answers) => {
    setTaxAnswers(answers);
    const results = checkAllTaxCredits(answers);
    setTaxResults(results);
    navigate('/results/both');
  };

  if (phase === 'benefits') {
    return <BenefitsScreener onComplete={handleBenefitsComplete} />;
  }

  return <TaxScreener onComplete={handleTaxComplete} prefill={benefitsAnswers} />;
}
