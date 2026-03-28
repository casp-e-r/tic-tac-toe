import { useState } from 'react';
import MatchmakingScreen from './components/MatchmakingScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [inGame, setInGame] = useState(false);

  return (
    <>
      {!inGame ? (
        <GameScreen onLeave={() => setInGame(false)} />
      ) : (
        <MatchmakingScreen onMatchFound={() => setInGame(true)} />
      )}
    </>
  );
}

export default App;
