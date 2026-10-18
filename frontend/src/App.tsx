import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';
import { PageMetadata } from './components/PageMetadata';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Assessment } from './pages/Assessment';
import { Explanation } from './pages/Explanation';
import { Methodology } from './pages/Methodology';
import { ResponsibleAI } from './pages/ResponsibleAI';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <Router>
      <StudentProvider>
        <PageMetadata />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
          <Navbar />
          <main className="flex-1" id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/explanation" element={<Explanation />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/responsible-ai" element={<ResponsibleAI />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </StudentProvider>
    </Router>
  );
};

export default App;
