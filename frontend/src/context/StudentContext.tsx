import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  StudentInput,
  PredictionResult,
  ExplanationResult,
  SampleProfile
} from '../types';
import { api, ApiError } from '../services/api';

export const DEFAULT_STUDENT: StudentInput = {
  age: 17,
  studytime: 2,
  absences: 4,
  failures: 0,
  G1: 11,
  G2: 11,
  schoolsup: 'no',
  famsup: 'yes',
  paid: 'no',
  activities: 'yes',
  higher: 'yes',
  internet: 'yes',
  romantic: 'no',
  Medu: 2,
  Fedu: 2,
  traveltime: 1,
  freetime: 3,
  goout: 3,
  health: 3,
};

interface StudentContextType {
  student: StudentInput;
  setStudent: React.Dispatch<React.SetStateAction<StudentInput>>;
  updateField: <K extends keyof StudentInput>(field: K, value: StudentInput[K]) => void;
  prediction: PredictionResult | null;
  explanation: ExplanationResult | null;
  loading: boolean;
  error: string | null;
  apiConnected: boolean;
  samples: SampleProfile[];
  runAssessment: (customInput?: StudentInput) => Promise<boolean>;
  loadSample: (sample: SampleProfile) => void;
  resetForm: () => void;
  checkConnection: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentInput>(DEFAULT_STUDENT);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [samples, setSamples] = useState<SampleProfile[]>([]);

  const checkConnection = async () => {
    try {
      const res = await api.checkHealth();
      if (res.status === 'healthy') {
        setApiConnected(true);
        setError(null);
      } else {
        setApiConnected(false);
      }
    } catch {
      setApiConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Fetch test set samples
    api.getSamples()
      .then((data) => setSamples(data))
      .catch(() => {
        // samples will remain empty if backend offline
      });
  }, []);

  const updateField = <K extends keyof StudentInput>(field: K, value: StudentInput[K]) => {
    setStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const runAssessment = async (customInput?: StudentInput): Promise<boolean> => {
    const inputToUse = customInput || student;
    setLoading(true);
    setError(null);

    try {
      // Execute predict and explain in parallel
      const [predResult, expResult] = await Promise.all([
        api.predict(inputToUse),
        api.explain(inputToUse),
      ]);

      setPrediction(predResult);
      setExplanation(expResult);
      setApiConnected(true);
      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during prediction.');
      }
      setApiConnected(false);
      return false;
    }
  };

  const loadSample = (sample: SampleProfile) => {
    setStudent(sample.features);
    runAssessment(sample.features);
  };

  const resetForm = () => {
    setStudent(DEFAULT_STUDENT);
    setPrediction(null);
    setExplanation(null);
    setError(null);
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        updateField,
        prediction,
        explanation,
        loading,
        error,
        apiConnected,
        samples,
        runAssessment,
        loadSample,
        resetForm,
        checkConnection,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
