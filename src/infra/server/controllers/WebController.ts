import GamesManager from "../../../services/GamesManager";
import { GameStatus, SecretNumberGame } from "../../../services/SecretNumberGame";
import ServerInput from "../ServerInput";
import ServerOutput from "../ServerOutput";

export default class WebController {
    private gamesManager: GamesManager;
    private input: ServerInput;
    private output: ServerOutput;
    private playersWaitingToUseCard: [string, boolean, string, boolean, string, string | undefined][] = [];

    constructor(gamesManager: GamesManager, input: ServerInput, output: ServerOutput) {
        this.input = input;
        this.output = output;
        this.gamesManager = gamesManager;
    }

    public async acceptUseCard(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
            return;
        }
        const cardName = req.query.cardName as string;
        if (cardName === undefined) {
            res.send("No card name.");
            return;
        }
        const playerTwoName = req.body.playerTwoName as string;
        if (cardName === undefined) {
            res.send("No card name.");
            return;
        }
        const game = this.gamesManager.getGame(gameId)
        const player = game.playersByName[playerName];
        const playerTwo = game.playersByName[playerTwoName];
        const card = player.availableCards.find(card => card.name === cardName);
        if (card === undefined) {
            res.send("No card found.");
            return;
        }
        this.output.clearOutput();
        game.useCard(player, playerTwo, card);
        const result = this.output.getOutput();
        const playerOneAndTwoWaitingToUseCard = this.playersWaitingToUseCard.find(playersAndCard => {
            return (playersAndCard[0] === playerName && playersAndCard[2] === playerTwoName && playersAndCard[4] === cardName) || (playersAndCard[0] === playerTwoName && playersAndCard[2] === playerName && playersAndCard[4] === cardName);
        })
        if (playerOneAndTwoWaitingToUseCard === undefined) {
            res.send("No players to set result.");
            return;
        }
        playerOneAndTwoWaitingToUseCard[5] = result;
        playerOneAndTwoWaitingToUseCard[1] = true;
        playerOneAndTwoWaitingToUseCard[3] = true;
        res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: cardName, resultText: result });
    }

    public async getEndGamePage(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
            return;
        }
        const game = this.gamesManager.getGame(gameId)
        if(Object.values(game.playersByName).every(player => Object.values(player.forecast).length !== 0)) {
            const scores = game.getScores();
            res.render('endGame', {playerName: playerName, gameId: gameId, scores: scores, players: Object.values(game.playersByName)})
        }
        res.render('endGame', {playerName: playerName, gameId: gameId});
    }

    public async getPage(req: any, res: any) {
        if (req.query.gameId !== undefined) {
            if (this.gamesManager.getGame(req.query.gameId) !== undefined) {
                this.gamesManager.getGame(req.query.gameId).endGame();
                this.gamesManager.removeGame(req.query.gameId);
            }
        }
        res.render('index', { numOfGames: this.gamesManager.getGames().length });
    }

    public async getSetPlayerForecastPage(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
            return;
        }
        res.render('setPlayerForecast', { gameId: gameId, playerName: playerName, players: Object.values(this.gamesManager.getGame(gameId).playersByName) });
    }

    public async removeAllGames(req: any, res: any) {
        if (req.query.code !== process.env.CODETOREMOVEALLGAMES) {
            res.send("Wrong code.");
            return;
        }
        this.gamesManager.removeAllGames();
        res.send("OK")
    }

    public async startGame(req: any, res: any) {
        const gameId = this.gamesManager.addGame(new SecretNumberGame(this.output, this.input, req.body.playersNumber));
        this.gamesManager.getGame(gameId).startGame();
        this.gamesManager.getGame(gameId).setPlayer(req.body.playerName);
        res.render('play', { gameId: gameId, playerName: req.body.playerName });
    }

    public async setPlayerForecast(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
            return;
        }
        const game = this.gamesManager.getGame(gameId)
        for(const player of Object.values(game.playersByName)) {
            if (req.body[player.name] === undefined) {
                this.input.setInput("");
            }
            this.input.setInput(req.body[player.name]);
        }
        game.setPlayerForecast(game.playersByName[playerName]);
        if(Object.values(game.playersByName).every(player => Object.values(player.forecast).length !== 0)) {
            const scores = game.getScores();
            res.render('endGame', {playerName: playerName, gameId: gameId, scores: scores, players: Object.values(game.playersByName)})
        }
        res.render('endGame', {playerName: playerName, gameId: gameId});
    }

    public async selectPlayerTwo(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
            return;
        }
        const cardName = req.body.cardName as string;
        if (cardName === undefined) {
            res.send("No card name.");
            return;
        }
        const game = this.gamesManager.getGame(gameId)
        const player = game.playersByName[playerName];
        const availablePlayers = []
        for (const player of Object.values(game.playersByName)) {
            if (player.name === playerName) {
                continue;
            }
            if (player.availableCards.find(card => card.name === cardName) !== undefined) {
                availablePlayers.push(player);
            }
        }
        res.render('selectPlayerTwo', { gameId: gameId, player: player, cardName: cardName, availablePlayers: availablePlayers });
    }

    public async endGame(req: any, res: any) {
        res.render('endGame', {})
    }

    public async registerPlayer(req: any, res: any) {
        const gameId = req.body.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        this.gamesManager.getGame(gameId).setPlayer(req.body.playerName as string);
        res.render('play', { gameId: gameId, playerName: req.body.playerName });
    }

    public async play(req: any, res: any) {
        const gameId = req.body.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const game = this.gamesManager.getGame(gameId)
        if (game.getStatus() !== GameStatus.STARTED) {
            if (game.isReady()) {
                game.startGame();
            } else {
                res.render('play', { gameId: gameId, playerName: req.body.playerName, playersLeft: game.getNumberOfPlayers() - Object.keys(game.playersByName).length });
                return;
            }
        }
        let playersWaitingWithCards = this.playersWaitingToUseCard.filter(playersAndCard => playersAndCard[2] == req.body.playerName && playersAndCard[5] === undefined ).map(playersAndCard => {return {playerName: playersAndCard[0], cardName: playersAndCard[4]}});
        res.render('cards', { gameId: gameId, player: game.playersByName[req.body.playerName], playersWaitingWithCards: playersWaitingWithCards });
    }

    public async useCard(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
            return;
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
            return;
        }
        const cardName = req.query.cardName as string;
        if (cardName === undefined) {
            res.send("No card name.");
            return;
        }
        const playerTwoName = req.body.playerTwoName as string;
        if (cardName === undefined) {
            res.send("No card name.");
            return;
        }
        const playerOneAndTwoWaitingToUseCard = this.playersWaitingToUseCard.find(playersAndCard => {
            return (playersAndCard[0] === playerName && playersAndCard[2] === playerTwoName && playersAndCard[4] === cardName) || (playersAndCard[0] === playerTwoName && playersAndCard[2] === playerName && playersAndCard[4] === cardName);
        });
        if ( playerOneAndTwoWaitingToUseCard === undefined) {
            this.playersWaitingToUseCard.push([playerName, true, playerTwoName, false, cardName, undefined]);
            res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: cardName});
            return;
        } else {
            if(playerOneAndTwoWaitingToUseCard[0] === playerName && playerOneAndTwoWaitingToUseCard[3] === false || playerOneAndTwoWaitingToUseCard[2] == playerName && playerOneAndTwoWaitingToUseCard[1] == false) {
                res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: cardName});
                return;
            } 
        }
        const result = playerOneAndTwoWaitingToUseCard[5]
        res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: cardName, resultText: result });
    }

}
