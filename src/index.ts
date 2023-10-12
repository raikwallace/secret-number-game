#!/usr/bin/env ts-node-script

import { Command } from "commander";
import * as readline from 'readline';

const figlet = require("figlet");

enum Cards {
    SUM = 0,
    MULTIPLY = 1,
    DIVIDE = 2,
    NUM_OF_ZEROS = 3,
}

class Player {
    public name: string;
    public number: number;
    public score: number;
    public cardsAbailable: number[];
    public forecast: {[key: string]: number | undefined}

    constructor(name: string, number: number, score: number, cardsAbailable: number[]) {
        this.name = name;
        this.number = number;
        this.score = score;
        this.cardsAbailable = cardsAbailable;
        this.forecast = {};
    }
}

class SecretNumberGame {
    public playersByName: { [key: string]: Player };
    private usedNumbers: number[];
    private numberOfPlayers: number;

    constructor(numberOfPlayers: number) {
        this.playersByName = {};
        this.usedNumbers = [];
        this.numberOfPlayers = numberOfPlayers;
    }

    public canPlayersPlay(): boolean {
        return Object.values(this.playersByName).some(player => player.cardsAbailable.length > 0 );   
    }

    public endGame(): void {
        console.log(figlet.textSync("Game ended.", { 
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
    }

    public getScores(): { [key: string]: number } {
        const scores: { [key: string]: number } = {};
        for (const playerName of Object.keys(this.playersByName)) {
            scores[playerName] = 0;
        }
        for(const player of Object.values(this.playersByName)) {
            let numberOfRightGuesses: number = 0;
            for(const otherPlayer of Object.values(this.playersByName)) {
                if (player.forecast[otherPlayer.name] === undefined) {
                    continue;
                }
                if (player.name === otherPlayer.name) {
                    if ( player.forecast[otherPlayer.name] === otherPlayer.number) {
                        scores[player.name] += 5;
                        numberOfRightGuesses += 1;
                    } else {
                        scores[player.name] -= 5;
                    }
                } else {
                    if (player.forecast[otherPlayer.name] === otherPlayer.number) {
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

    public startGame(): void {
        if (Object.keys(this.playersByName).length < this.numberOfPlayers) {
            console.log("Not enough players.");
            return;
        }
        Object.values(this.playersByName).forEach(player => {
            player.cardsAbailable = [Cards.SUM, Cards.MULTIPLY, Cards.DIVIDE, Cards.NUM_OF_ZEROS]
        });
        console.log(figlet.textSync("Game starts.", { 
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
    }

    public setPlayer(playerName: string): void {
        const number = this.generateNumber();
        const player = new Player(playerName, number, 0, []);
        this.playersByName[playerName] = player;
        this.usedNumbers.push(number);
    }

    private generateNumber(): number {
        let number = 0;
        while (number in this.usedNumbers || number === 0) {
            number = Math.floor(Math.random() * 100) + 1;
        }
        return number;
    }
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function readLineAsync(msg: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(msg, (answer) => {
            resolve(answer);
        });
    });
}

async function start() {
    const program = new Command();

    console.log(figlet.textSync("SECRET-NUMBER", { 
        font:  'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }));

    program.version("0.1.0")
        .description("A CLI game to guess the secret number.")
        .option("-n, --players-number <number>", "The number of players.", "10")
        .parse(process.argv);

    const options = program.opts();
    const game = new SecretNumberGame(options.playersNumber);

    for (let i = 0; i < options.playersNumber; i++) {
        const playerName = await readLineAsync(`Player ${i+1} name? `);
        game.setPlayer(playerName);
    }

    game.startGame();
    let endGame = false;
    while (!endGame && game.canPlayersPlay()) {
        const shouldGameEnd = await readLineAsync(`Should the game end? (y/n) `);
        if (shouldGameEnd === "y") {
            endGame = true;
            continue;
        }
        console.log(figlet.textSync("Select a player or pass:", { 
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
        console.log(`0. Pass`);
        Object.keys(game.playersByName).forEach((playerName, index) => {
            console.log(`${index+1}. ${playerName}`);
        });
        const playerIndexOne = await readLineAsync(`Select a player: `);
        if (playerIndexOne === "0" || Number(playerIndexOne) > Object.keys(game.playersByName).length) {
            continue;
        }
        const playerIndexTwo = await readLineAsync(`Select another player: `);
        if (playerIndexTwo === "0"|| Number(playerIndexOne) > Object.keys(game.playersByName).length) {
            continue;
        }
        const playerOne = Object.values(game.playersByName)[Number(playerIndexOne)-1];
        const playerTwo = Object.values(game.playersByName)[Number(playerIndexTwo)-1];
        const commonCardsAbailable = playerOne.cardsAbailable.filter(value => playerTwo.cardsAbailable.includes(value));
        if (commonCardsAbailable.length === 0) {
            console.log("No common cards.");
            continue;
        }
        console.log(`0. Pass`);
        commonCardsAbailable.forEach((card, index) => {
            console.log(`${index+1}. ${Cards[card]}`);
        });
        const cardIndex = await readLineAsync(`Select a card: `);
        if (cardIndex === "0" || Number(cardIndex) > 4) {
            continue;
        }
        const card = commonCardsAbailable[Number(cardIndex)-1];
        switch (card) {
            case Cards.SUM:
                console.log(figlet.textSync(`${playerOne.name} plus ${playerTwo.name} : ${playerOne.number + playerTwo.number}`, { 
                    font:  'ANSI Shadow',
                    horizontalLayout: 'default',
                    verticalLayout: 'default'
                }));
                break;
            case Cards.MULTIPLY:
                console.log(figlet.textSync(`${playerOne.name} * ${playerTwo.name} : ${playerOne.number * playerTwo.number}`, { 
                    font:  'ANSI Shadow',
                    horizontalLayout: 'default',
                    verticalLayout: 'default'
                }));
                break;
            case Cards.DIVIDE:
                console.log(figlet.textSync(`${playerOne.name} / ${playerTwo.name} : ${Math.round(Math.max(playerOne.number, playerTwo.number) / Math.min(playerTwo.number, playerOne.number))}`, { 
                    font:  'ANSI Shadow',
                    horizontalLayout: 'default',
                    verticalLayout: 'default'
                }));
                break;
            case Cards.NUM_OF_ZEROS:
                console.log(figlet.textSync(`Zeros ${playerOne.name} to ${playerTwo.name} = ${Math.round((Math.max(playerOne.number, playerTwo.number) - Math.min(playerTwo.number + 1, playerOne.number + 1))/10)}`, { 
                    font:  'ANSI Shadow',
                    horizontalLayout: 'default',
                    verticalLayout: 'default'
                }));
                break;
        }
        playerOne.cardsAbailable = playerOne.cardsAbailable.filter(value => value !== card);
        playerTwo.cardsAbailable = playerTwo.cardsAbailable.filter(value => value !== card);
    }
    for (const player of Object.values(game.playersByName)) {
        console.log(figlet.textSync(`${player.name} your forecast:`, { 
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
        for (const otherPlayer of Object.values(game.playersByName)) {
            const forecast = await readLineAsync(`${otherPlayer.name} forecast: `);
            if (forecast === "" || Number(forecast) < 1 || Number(forecast) >= 100) {
                player.forecast[otherPlayer.name] = undefined;
            } else {
                player.forecast[otherPlayer.name] = Number(forecast);
            }
        }
        console.clear();
    };
    const scores = game.getScores();
    for (const score of Object.entries(scores)) {
        console.log(figlet.textSync(`${score[0]} score: ${score[1]}`, { 
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
    }
    for (const player of Object.values(game.playersByName)) {
        console.log(figlet.textSync(`${player.name} number: ${player.number}`, {
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
    }
    game.endGame();
    rl.close()
}

start()
