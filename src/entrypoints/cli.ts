#!/usr/bin/env ts-node-script

import { Command } from "commander";
import { SecretNumberGame } from "../services/SecretNumberGame";
import { DivideCard, MultiplyCard, NumOfZerosCard, SumCard } from "../model/Card";
import ConsoleOutput from "../infra/console/ConsoleOutput";
import ConsoleInput from "../infra/console/ConsoleInput";

async function start(output: ConsoleOutput, input: ConsoleInput) {
    const program = new Command();

    output.showImportantMessage("Secret number game!");

    program.version("0.1.0")
        .description("A CLI game to guess the secret number.")
        .option("-n, --players-number <number>", "The number of players.", "10")
        .parse(process.argv);

    const options = program.opts();
    const game = new SecretNumberGame(output, input, options.playersNumber);

    game.registerPlayers(options.playersNumber);

    game.startGame();
    let endGame = false;
    while (!endGame && game.canPlayersPlay()) {
        const shouldGameEnd = await input.getInput(`Should the game end? (y/n) `);
        if (shouldGameEnd === "y") {
            endGame = true;
            continue;
        }
        output.showImportantMessage("Select two players and a card.");
        output.showMessage(`0. Pass`);
        Object.keys(game.playersByName).forEach((playerName, index) => {
            output.showMessage(`${index+1}. ${playerName}`);
        });
        const playerIndexOne = await input.getInput(`Select a player: `);
        if (playerIndexOne === "0" || Number(playerIndexOne) > Object.keys(game.playersByName).length) {
            continue;
        }
        const playerIndexTwo = await input.getInput(`Select another player: `);
        if (playerIndexTwo === "0"|| Number(playerIndexOne) > Object.keys(game.playersByName).length) {
            continue;
        }
        const playerOne = Object.values(game.playersByName)[Number(playerIndexOne)-1];
        const playerTwo = Object.values(game.playersByName)[Number(playerIndexTwo)-1];
        const commonCardsAvailable = playerOne.cardsAvailable.filter(value => playerTwo.cardsAvailable.includes(value));
        if (commonCardsAvailable.length === 0) {
            output.showMessage("No common cards.");
            continue;
        }
        output.showMessage(`0. Pass`);
        commonCardsAvailable.forEach((card, index) => {
            output.showMessage(`${index+1}. ${card.constructor.name}`);
        });
        const cardIndex = await input.getInput(`Select a card: `);
        if (cardIndex === "0" || Number(cardIndex) > 4) {
            continue;
        }
        const card = commonCardsAvailable[Number(cardIndex)-1];
        game.useCard(playerOne, playerTwo, card);
    }
    for (const player of Object.values(game.playersByName)) {
        game.setPlayerForecast(player);
        console.clear();
    };
    game.showScores();

    game.endGame();
    input.close()
}

start(new ConsoleOutput(), new ConsoleInput())
