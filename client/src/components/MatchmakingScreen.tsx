import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Swords } from 'lucide-react';

interface MatchmakingProps {
  onMatchFound: () => void;
}

export default function MatchmakingScreen({ onMatchFound }: MatchmakingProps) {
  const [isSearching, setIsSearching] = useState(false);

  const startSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onMatchFound();
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950 p-4 justify-center">
      <Card className="w-full bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tic-Tac-Toe
          </CardTitle>
          <CardDescription className="text-slate-400">Text</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex flex-col items-center space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <Avatar className="w-20 h-20 border-2 border-purple-500 shadow-lg shadow-purple-500/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Player1`} />
              <AvatarFallback>Player name</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-slate-200">Player name</h3>
              <Badge variant="outline" className="mt-1 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                status
              </Badge>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              size="lg"
              className={`w-full text-lg h-14 transition-all duration-300 ${isSearching ? 'bg-slate-800 text-blue-400 border border-blue-500/50' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'}`}
              onClick={startSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Searching for opponent...</>
              ) : (
                <><Search className="mr-2 h-5 w-5" />Find Match</>
              )}
            </Button>

            <Button variant="outline" size="lg" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 h-14" disabled={isSearching}>
              <Swords className="mr-2 h-5 w-5" />
              Some Text
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center pt-2 pb-6 text-sm text-slate-500">
          Some text
        </CardFooter>
      </Card>
    </div>
  );
}