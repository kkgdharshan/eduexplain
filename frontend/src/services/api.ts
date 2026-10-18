import type {
  StudentInput,
  PredictionResult,
  ExplanationResult,
  WhatIfResult,
  ModelMetrics,
  GlobalFeature,
  SampleProfile
} from '../types';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`)
  : '/api';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errorMsg = `Server responded with status ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errorMsg = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // use default errorMsg
      }
      throw new ApiError(errorMsg, res.status);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or connection failure
    throw new ApiError(
      'Model service is currently unreachable. Please verify that the backend API server is online and VITE_API_URL is configured correctly.',
      0
    );
  }
}

export const api = {
  async checkHealth(): Promise<{ status: string; model_loaded: boolean; dataset: string }> {
    return request('/health');
  },

  async getMetrics(): Promise<ModelMetrics> {
    return request('/metrics');
  },

  async getGlobalImportance(): Promise<GlobalFeature[]> {
    return request('/global-importance');
  },

  async getSamples(): Promise<SampleProfile[]> {
    return request('/samples');
  },

  async predict(student: StudentInput): Promise<PredictionResult> {
    return request('/predict', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  },

  async explain(student: StudentInput): Promise<ExplanationResult> {
    return request('/explain', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  },

  async whatIf(baseline: StudentInput, modified: StudentInput): Promise<WhatIfResult> {
    return request('/what-if', {
      method: 'POST',
      body: JSON.stringify({ baseline, modified }),
    });
  },
};
