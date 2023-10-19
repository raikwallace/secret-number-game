import GamesManager from "../../../services/GamesManager";
import { SecretNumberGame } from "../../../services/SecretNumberGame";
import ServerInput from "../ServerInput";
import ServerOutput from "../ServerOutput";

export default class GameController {
    private gamesManager: GamesManager;
    private input: ServerInput;
    private output: ServerOutput;

    constructor(gamesManager: GamesManager, input: ServerInput, output: ServerOutput) {
        this.input = input;
        this.output = output;
        this.gamesManager = gamesManager;
    }

    public async endGame(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        this.gamesManager.getGame(gameId).showScores()
        this.gamesManager.getGame(gameId).endGame();
        res.send(this.output.getOutput());
    }

    public async getPlayers(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        res.send(this.gamesManager.getGame(gameId).playersByName);
    }   

    public async startGame(req: any, res: any) {
        const gameId = this.gamesManager.addGame(new SecretNumberGame(this.output, this.input, req.body.playersNumber));
        this.gamesManager.getGame(gameId).startGame();
        for(const playerName of req.body.playersName) {
            this.input.setInput(playerName);
        }
        this.gamesManager.getGame(gameId).registerPlayers(req.body.playersNumber);
        res.send(gameId);
    }

    public async setPlayerForecast(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        const game = this.gamesManager.getGame(gameId)
        const player = game.playersByName[req.body.playerName];
        const forecast = req.body.forecast;
        for (const player of Object.values(game.playersByName)) {
            this.input.setInput(forecast[player.name]);
        }
        game.setPlayerForecast(player);
    }

    public async useCard(req: any, res: any) {
        const gameId = req.query.gameId as number;
        if (gameId === undefined) {
            res.send("No game id.");
        }
        const game = this.gamesManager.getGame(gameId)
        const playerOne = game.playersByName[req.body.playerOneName];
        const playerTwo = game.playersByName[req.body.playerTwoName];
        const commonCardsAvailable = playerOne.cardsAvailable.filter(value => playerTwo.cardsAvailable.includes(value));
        if (commonCardsAvailable.length === 0) {
            res.send("No common cards.");
            return;
        }
        const card = commonCardsAvailable.find(card => card.constructor.name === req.body.card);
        if (card === undefined) {
            res.send("Card not found.");
            return;
        }
        game.useCard(playerOne, playerTwo, card);
    }

}
