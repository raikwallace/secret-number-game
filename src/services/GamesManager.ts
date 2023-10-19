import { SecretNumberGame } from "./SecretNumberGame";

export default class GamesManager {
    private games: SecretNumberGame[] = [];

    public addGame(game: SecretNumberGame): number {
        this.games.push(game);
        return this.games.length - 1;
    }

    public getGame(id: number): SecretNumberGame {
        return this.games[id];
    }

    public removeGame(id: number): void {
        this.games.splice(id, 1);
    }

}
