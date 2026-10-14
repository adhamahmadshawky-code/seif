import { AudioProvider } from './hooks/useAudioEngine';
import GameShell from './components/GameShell';

export default function App() {
  return (
    <AudioProvider>
      <GameShell />
    </AudioProvider>
  );
}
