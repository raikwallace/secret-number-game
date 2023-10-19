import { Card } from "./Card";

export default class Player {
    public name: string;
    public number: number;
    public score: number;
    public cardsAvailable: Card[];
    public forecast: {[key: string]: number | undefined}

    constructor(name: string, number: number, score: number, cardsAvailable: Card[]) {
        this.name = name;
        this.number = number;
        this.score = score;
        this.cardsAvailable = cardsAvailable;
        this.forecast = {};
    }
}
