import { Card, DivideCard, MultiplyCard, NumOfZerosCard, SumCard } from "../model/Card";
import Player from "../model/Player";
import Input from "./Input";
import Output from "./Output";

export enum GameStatus {
    STARTED = "STARTED",
    WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
}

export class SecretNumberGame {
    public playersByName: { [key: string]: Player };
    private status: GameStatus = GameStatus.WAITING_FOR_PLAYERS;
    private output: Output;
    private input: Input;
    private usedNumbers: number[];
    private numberOfPlayers: number;

    constructor(output: Output, input: Input, numberOfPlayers: number) {
        this.output = output;
        this.input = input;
        this.playersByName = {};
        this.usedNumbers = [];
        this.numberOfPlayers = numberOfPlayers;
    }

    public canPlayersPlay(): boolean {
        return Object.values(this.playersByName).some(player => player.availableCards.length > 0 );   
    }

    public endGame(): void {
        this.output.showImportantMessage("Game ended.");
    }

    public getScores(): { [key: string]: number } {
        const scores: { [key: string]: number } = {};
        for (const playerName of Object.keys(this.playersByName)) {
            scores[playerName] = 0;
        }
        for(const player of Object.values(this.playersByName)) {
            let numberOfRightGuesses: number = 0;
            for(const otherPlayer of Object.values(this.playersByName)) {
                if (player.guess[otherPlayer.name] === undefined) {
                    continue;
                }
                if (player.name === otherPlayer.name) {
                    if ( player.guess[otherPlayer.name] === otherPlayer.number) {
                        scores[player.name] += 5;
                        numberOfRightGuesses += 1;
                    } else {
                        scores[player.name] -= 5;
                    }
                } else {
                    if (player.guess[otherPlayer.name] === otherPlayer.number) {
                        scores[player.name] += 1;
                        scores[otherPlayer.name] -= 1;
                        numberOfRightGuesses += 1;
                    } else {
                        scores[player.name] -= 1;
                    }
                }
            }
            if(numberOfRightGuesses === Object.keys(this.playersByName).length) {
                scores[player.name] += 5;
            }
        }
        return scores ;
    }

    public getNumberOfPlayers(): number {
        return this.numberOfPlayers;
    }

    public getStatus(): GameStatus {
        return this.status;
    }

    public isReady(): boolean {
        return Object.keys(this.playersByName).length == this.numberOfPlayers;
    }

    public async registerPlayers(playersNumber: number): Promise<void> {
        for (let i = 0; i < playersNumber; i++) {
            const playerName = await this.input.getInput(`Player ${i+1} name? `);
            this.setPlayer(playerName);
        }
    }
    
    public setPlayer(playerName: string): void {
        const number = this.generateNumber();
        const player = new Player(playerName, number, 0, []);
        this.playersByName[playerName] = player;
        this.usedNumbers.push(number);
    }

    public async setPlayerGuess(player: Player): Promise<void> {
        this.output.showImportantMessage(`${player.name} your guess:`);
        for (const otherPlayer of Object.values(this.playersByName)) {
            const guess = await this.input.getInput(`${otherPlayer.name} guess: `);
            if (guess === "" || Number(guess) < 1 || Number(guess) >= 100) {
                player.guess[otherPlayer.name] = undefined;
            } else {
                player.guess[otherPlayer.name] = Number(guess);
            }
        }
    }

    public showScores(): void {
        for (const score of Object.entries(this.getScores())) {
            this.output.showImportantMessage(`${score[0]} score: ${score[1]}`)
        }
        for (const player of Object.values(this.playersByName)) {
            this.output.showImportantMessage(`${player.name} number: ${player.number}`)
        }
    }

    public startGame(): void {
        if (!this.isReady()) {
            this.output.showMessage("Not enough players.");
            return;
        }
        Object.values(this.playersByName).forEach(player => {
            player.availableCards = [new SumCard(), new MultiplyCard(), new DivideCard(), new NumOfZerosCard()]
        });
        this.status = GameStatus.STARTED;
        this.output.showImportantMessage("Game started.");
    }

    public useCard(playerOne: Player, playerTwo: Player, card: Card): void {
        switch (card.constructor) {
            case SumCard:
                this.output.showImportantMessage(`${playerOne.name} plus ${playerTwo.name} : ${playerOne.number + playerTwo.number}`);
                break;
            case MultiplyCard:
                this.output.showImportantMessage(`${playerOne.name} * ${playerTwo.name} : ${playerOne.number * playerTwo.number}`);
                break;
            case DivideCard:
                this.output.showImportantMessage(`${playerOne.name} / ${playerTwo.name} : ${Math.round(Math.max(playerOne.number, playerTwo.number) / Math.min(playerTwo.number, playerOne.number))}`);
                break;
            case NumOfZerosCard:
                this.output.showImportantMessage(`Zeros ${playerOne.name} to ${playerTwo.name} = ${Math.round((Math.max(playerOne.number, playerTwo.number) - Math.min(playerTwo.number + 1, playerOne.number + 1))/10)}`);
                break;
        }
        playerOne.availableCards = playerOne.availableCards.filter(value => value.name !== card.name);
        playerTwo.availableCards = playerTwo.availableCards.filter(value => value.name !== card.name);
    }

    private generateNumber(): number {
        let number = 0;
        while (number in this.usedNumbers || number === 0) {
            number = Math.floor(Math.random() * 100) + 1;
        }
        return number;
    }
}
