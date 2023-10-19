export  interface Card {
    applyEffect(firstNumber: number, secondNumber: number): number;
}

export class SumCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return firstNumber + secondNumber;
    }
}

export class DivideCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return Math.round(Math.max(firstNumber, secondNumber) / Math.min(firstNumber, secondNumber));
    }
}

export class MultiplyCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return firstNumber * secondNumber;
    }
}

export class NumOfZerosCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return Math.round((Math.max(firstNumber, secondNumber) - Math.min(firstNumber + 1, secondNumber + 1))/10);
    }
}
