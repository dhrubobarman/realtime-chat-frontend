import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from './pages/error-pages/ErrorBoundary.tsx';
import { ThemeProvider } from './components/ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="realtime-chat-theme">
        <App />
        <Toaster closeButton />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
