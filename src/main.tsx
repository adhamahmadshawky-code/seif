import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/game.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root not found');
}

// Note: StrictMode is intentionally omitted. Its double-invoked effects in
// development would create/destroy the audio element twice, which can cause a
// track to restart unexpectedly. The engine is written to be idempotent, but
// keeping a single mount avoids any audible glitch for the listener.
createRoot(container).render(<App />);
