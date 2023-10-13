interface Card {
    applyEffect(firstNumber: number, secondNumber: number): number;
}

class SumCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return firstNumber + secondNumber;
    }
}

class DivideCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return Math.round(Math.max(firstNumber, secondNumber) / Math.min(firstNumber, secondNumber));
    }
}

class MultiplyCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return firstNumber * secondNumber;
    }
}

class NumOfZerosCard implements Card {
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return Math.round((Math.max(firstNumber, secondNumber) - Math.min(firstNumber + 1, secondNumber + 1))/10);
    }
}
