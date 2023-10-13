#!/usr/bin/env ts-node-script

import { Command } from "commander";
import * as readline from 'readline';

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

async function start(output: Output) {
    const program = new Command();

    output.showImportantMessage("Secret number game!");

    program.version("0.1.0")
        .description("A CLI game to guess the secret number.")
        .option("-n, --players-number <number>", "The number of players.", "10")
        .parse(process.argv);

    const options = program.opts();
    const game = new SecretNumberGame(output, options.playersNumber);

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
        output.showImportantMessage("Select two players and a card.");
        output.showMessage(`0. Pass`);
        Object.keys(game.playersByName).forEach((playerName, index) => {
            output.showMessage(`${index+1}. ${playerName}`);
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
            output.showMessage("No common cards.");
            continue;
        }
        output.showMessage(`0. Pass`);
        commonCardsAbailable.forEach((card, index) => {
            output.showMessage(`${index+1}. ${Cards[card]}`);
        });
        const cardIndex = await readLineAsync(`Select a card: `);
        if (cardIndex === "0" || Number(cardIndex) > 4) {
            continue;
        }
        const card = commonCardsAbailable[Number(cardIndex)-1];
        switch (card) {
            case SumCard:
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

start(new ConsoleOutput())
