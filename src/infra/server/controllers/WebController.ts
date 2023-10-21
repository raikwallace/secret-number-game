import GamesManager from "../../../services/GamesManager";
import { GameStatus, SecretNumberGame } from "../../../services/SecretNumberGame";
import ServerInput from "../ServerInput";
import ServerOutput from "../ServerOutput";

export default class WebController {
    private gamesManager: GamesManager;
    private input: ServerInput;
    private output: ServerOutput;
    private playersWaitingToUseCard: [string, boolean, string, boolean, string][] = [];

    constructor(gamesManager: GamesManager, input: ServerInput, output: ServerOutput) {
        this.input = input;
        this.output = output;
        this.gamesManager = gamesManager;
    }

    public async acceptUseCard(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
        }
        const cardName = req.query.cardName as string;
        if (cardName === undefined) {
            res.send("No card name.");
        }
        const playerTwoName = req.body.playerTwoName as string;
        if (cardName === undefined) {
            res.send("No card name.");
        }
        const game = this.gamesManager.getGame(gameId)
        const player = game.playersByName[playerName];
        const playerTwo = game.playersByName[playerTwoName];
        const card = player.availableCards.find(card => card.name === cardName);
        if (card === undefined) {
            res.send("No card found.");
            return;
        }
        game.useCard(player, playerTwo, card);
        res.render('result', { gameId: gameId, playerName: req.body.playerName, resultText: this.output.getOutput() });
    }

    public async getPage(req: any, res: any) {
        res.render('index', { numOfGames: this.gamesManager.getGames().length });
    }

    public async startGame(req: any, res: any) {
        const gameId = this.gamesManager.addGame(new SecretNumberGame(this.output, this.input, req.body.playersNumber));
        this.gamesManager.getGame(gameId).startGame();
        this.gamesManager.getGame(gameId).setPlayer(req.body.playerName);
        res.render('play', { gameId: gameId, playerName: req.body.playerName });
    }

    public async setPlayerForecast(req: any, res: any) {
    }

    public async selectPlayerTwo(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
        }
        const cardName = req.body.cardName as string;
        if (cardName === undefined) {
            res.send("No card name.");
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

    public async endGame(req: any, res: any) {}

    public async registerPlayer(req: any, res: any) {
        const gameId = req.body.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        this.gamesManager.getGame(gameId).setPlayer(req.body.playerName as string);
        res.render('play', { gameId: gameId, playerName: req.body.playerName });
    }

    public async play(req: any, res: any) {
        const gameId = req.body.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        const game = this.gamesManager.getGame(gameId)
        if (game.getStatus() !== GameStatus.STARTED) {
            if (game.isReady()) {
                game.startGame();
            } else {
                res.render('play', { gameId: gameId, playerName: req.body.playerName, playersLeft: game.getNumberOfPlayers() - Object.keys(game.playersByName).length });
            }
        }
        console.log(this.playersWaitingToUseCard);
        console.log(req.body.playerName);
        let playersWaiting = this.playersWaitingToUseCard.filter(playersAndCard => playersAndCard[2] == req.body.playerName).map(playersAndCard => playersAndCard[0]);
        // playersWaiting = playersWaiting.concat(this.playersWaitingToUseCard.filter(playersAndCard => playersAndCard[2] == req.body.playerName).map(playersAndCard => playersAndCard[0]));
        console.log(playersWaiting);
        res.render('cards', { gameId: gameId, player: game.playersByName[req.body.playerName], playersWaiting: playersWaiting });
    }

    public async useCard(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        const playerName = req.query.playerName as string;
        if (playerName === undefined) {
            res.send("No player name.");
        }
        const cardName = req.query.cardName as string;
        if (cardName === undefined) {
            res.send("No card name.");
        }
        const playerTwoName = req.body.playerTwoName as string;
        if (cardName === undefined) {
            res.send("No card name.");
        }
        const playerOneAndTwoWaitingToUseCard = this.playersWaitingToUseCard.find(playersAndCard => {
            return (playersAndCard[0] === playerName && playersAndCard[2] === playerTwoName && playersAndCard[4] === cardName) || (playersAndCard[0] === playerTwoName && playersAndCard[2] === playerName && playersAndCard[4] === cardName);
        });
        if ( playerOneAndTwoWaitingToUseCard === undefined) {
            this.playersWaitingToUseCard.push([playerName, true, playerTwoName, false, cardName]);
            res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: cardName});
        } else {
            if(playerOneAndTwoWaitingToUseCard[0] === playerName && playerOneAndTwoWaitingToUseCard[3] === false || playerOneAndTwoWaitingToUseCard[2] == playerName && playerOneAndTwoWaitingToUseCard[1] == false) {
                res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: cardName});
            } 
        }
        const game = this.gamesManager.getGame(gameId)
        const card = game.playersByName[playerTwoName].availableCards.find(card => card.name === cardName);
        if (card === undefined) {
            res.send("No card found.");
            return;
        }
        game.useCard(game.playersByName[playerName], game.playersByName[playerTwoName], card);
        res.render('useCard', { gameId: gameId, playerName: req.query.playerName, playerTwoName: playerTwoName, cardName: card.name, resultText: this.output.getOutput() });
    }

}
