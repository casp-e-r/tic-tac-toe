import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Circle, AlertCircle, ArrowLeft } from 'lucide-react';

interface GameScreenProps {
  onLeave: () => void;
}

export default function GameScreen({ onLeave }: GameScreenProps) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i: number) => {
    if (board[i] || calculateWinner(board)) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const renderSquare = (i: number) => {
    return (
      <button 
        className="h-24 md:h-32 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 rounded-xl flex items-center justify-center text-5xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        onClick={() => handleClick(i)}
        disabled={!!board[i] || !!winner}
      >
        {board[i] === 'X' && <X className="w-16 h-16 text-blue-400" strokeWidth={2.5} />}
        {board[i] === 'O' && <Circle className="w-14 h-14 text-rose-400" strokeWidth={3} />}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 font-sans w-full">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={onLeave}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Match
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 w-full max-w-5xl items-center px-4">
        {/* Player 1 Details */}
        <Card className={`bg-slate-900 border-slate-800 ${xIsNext && !winner ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''} transition-all`}>
          <CardContent className="p-6 flex flex-col items-center space-y-4 text-slate-100">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-slate-800">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Player1`} />
                <AvatarFallback>P1</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 border-4 border-slate-900">
                <X className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold border-none text-xl">You</h3>
              <p className="text-slate-400 text-sm">text</p>
            </div>
          </CardContent>
        </Card>

        {/* The Board */}
        <div className="bg-slate-900 p-4 md:p-6 rounded-2xl shadow-2xl border border-slate-800 mx-auto">
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full flex-1 aspect-square max-w-[400px] min-w-[280px]">
            {board.map((_, i) => (
              <div key={i}>{renderSquare(i)}</div>
            ))}
          </div>
        </div>

        {/* Opponent */}
        <Card className={`bg-slate-900 border-slate-800 ${!xIsNext && !winner ? 'ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20' : ''} transition-all`}>
          <CardContent className="p-6 flex flex-col items-center space-y-4 text-slate-100">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-slate-800">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Opponent`} />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -left-2 bg-rose-500 rounded-full p-2 border-4 border-slate-900">
                <Circle className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold border-none text-xl">opponent player</h3>
              <p className="text-slate-400 text-sm">text</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Status Overlay */}
      <div className="mt-12 text-center h-20 flex items-center justify-center">
        {winner ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
              {winner === 'X' ? 'VICTORY!' : 'DEFEAT!'}
            </h2>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200" onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}>
              Play Again
            </Button>
          </div>
        ) : isDraw ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <h2 className="text-3xl font-bold mb-4 text-slate-300">It's a Draw!</h2>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300" onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}>
              Rematch
            </Button>
          </div>
        ) : (
          <div className="flex items-center text-xl font-medium text-slate-300 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
            <AlertCircle className="mr-3 text-blue-400" />
            {xIsNext ? "It's your turn!" : "Waiting for opponent..."}
          </div>
        )}
      </div>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
