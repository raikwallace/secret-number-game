import { Request, Response } from 'express';

type Player = {
    name: string;
    score: number;
    currentVisibleHand: number;
    currentHiddenHand: number;
};

enum HighLowGameStatus {
    STARTED = 'started',
    FINISHED = 'finished',
}

type HighLowGame = {
    id: number;
    players: Player[];
    status: HighLowGameStatus;
};

export default class HighLowGameController {
    
    constructor(private games: HighLowGame[] = []) {}
    
    public async getGames(req: Request, res: Response): Promise<void> {
        res.json(this.games);
    }
    
    public async startGame(req: Request, res: Response): Promise<void> {
        const players: Player[] = [];
        const playerNames: string[] = req.body.playerNames;
        for (const playerName of playerNames) {
            if (typeof playerName !== 'string' || playerName.length === 0) {
                res.status(400).send('Invalid player name');
                return;
            }
            if (playerName in players.map(player => player.name)) {
                res.status(400).send('Duplicate player name');
                return;
            }
            players.push({
                name: playerName,
                score: 0,
                currentVisibleHand: 0,
                currentHiddenHand: 0,
            });
        }
        const game = { id: this.games.length, players: players, status: HighLowGameStatus.STARTED }
        this.games.push(game);
        res.json({id: game.id});
    }

    public async getGameForPlayer(req: Request, res: Response): Promise<void> {
        const gameId = parseInt(req.params.gameId);
        const playerName = req.query['playerName'] as string;
        if (isNaN(gameId) || gameId < 0 || gameId >= this.games.length || !this.games[gameId]) {
            res.status(404).send('Game not found');
            return;
        }
        const game = this.games[gameId].players.map(player => {
            if (player.name !== playerName) {
                return {
                    name: player.name,
                    score: player.score,
                    currentVisibleHand: player.currentVisibleHand,
                };
            }
            return player;
        });
        res.json(game);
    }


}
