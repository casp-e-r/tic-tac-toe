import { useState } from 'react';
import MatchmakingScreen from './components/MatchmakingScreen';
import GameScreen from './components/GameScreen';
import { AuthGate } from './auth/AuthGuard';

function App() {
  const [inGame, setInGame] = useState(false);

  return (
    <AuthGate>
      {!inGame ? (
        <GameScreen onLeave={() => setInGame(false)} />
      ) : (
        <MatchmakingScreen onMatchFound={() => setInGame(true)} />
      )}
    </AuthGate>
  );
}

export default App;
