import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import App from './App';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { ShopProvider } from './store/ShopProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* reducedMotion="user" turns transform and layout animations off for people who ask their OS for less motion */}
      <MotionConfig reducedMotion="user">
        <ShopProvider>
          <App />
        </ShopProvider>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
);
