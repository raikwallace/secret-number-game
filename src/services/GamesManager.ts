import { SecretNumberGame } from "./SecretNumberGame";

export default class GamesManager {
    private games: (SecretNumberGame | undefined)[] = [];

    public addGame(game: SecretNumberGame): number {
        this.games.push(game);
        return this.games.length - 1;
    }

    public getGame(id: number): SecretNumberGame {
        const game = this.games[id];
        if (game === undefined) {
            throw new Error("Game not found");
        }
        return game
    }

    public getGames(): SecretNumberGame[] {
        return this.games.filter((game) => game !== undefined) as SecretNumberGame[];
    }

    public removeAllGames(): void {
        this.games = [];
    }

    public removeGame(id: number): void {
        this.games[id] = undefined;
    }

}
