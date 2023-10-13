class Player {
    public name: string;
    public number: number;
    public score: number;
    public cardsAbailable: Card[];
    public forecast: {[key: string]: number | undefined}

    constructor(name: string, number: number, score: number, cardsAbailable: Card[]) {
        this.name = name;
        this.number = number;
        this.score = score;
        this.cardsAbailable = cardsAbailable;
        this.forecast = {};
    }
}
