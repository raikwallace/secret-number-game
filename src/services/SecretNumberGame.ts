class SecretNumberGame {
    public playersByName: { [key: string]: Player };
    private output: Output;
    private usedNumbers: number[];
    private numberOfPlayers: number;

    constructor(output: Output, numberOfPlayers: number) {
        this.output = output;
        this.playersByName = {};
        this.usedNumbers = [];
        this.numberOfPlayers = numberOfPlayers;
    }

    public canPlayersPlay(): boolean {
        return Object.values(this.playersByName).some(player => player.cardsAbailable.length > 0 );   
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
            this.output.showMessage("Not enough players.");
            return;
        }
        Object.values(this.playersByName).forEach(player => {
            player.cardsAbailable = [new SumCard(), new MultiplyCard(), new DivideCard(), new NumOfZerosCard()]
        });
        this.output.showImportantMessage("Game started.");
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
