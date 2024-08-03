import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from './pages/error-pages/ErrorBoundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <>
        <App />
        <Toaster closeButton />
      </>
    </ErrorBoundary>
  </React.StrictMode>
);
