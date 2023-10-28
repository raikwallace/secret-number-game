export  interface Card {
    name: string;
    applyEffect(firstNumber: number, secondNumber: number): number;
}

export class SumCard implements Card {
    public name: string = "Sum";
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return firstNumber + secondNumber;
    }
}

export class DivideCard implements Card {
    public name: string = "Divide";
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return Math.round(Math.max(firstNumber, secondNumber) / Math.min(firstNumber, secondNumber));
    }
}

export class MultiplyCard implements Card {
    public name: string = "Multiply";
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        return firstNumber * secondNumber;
    }
}

export class NumOfZerosCard implements Card {
    public name: string = "Number Of Zeros";
    constructor() {}

    public applyEffect(firstNumber: number, secondNumber: number): number {
        firstNumber = Math.floor(firstNumber/10);
        secondNumber = Math.floor(secondNumber/10);
        return Math.round((Math.max(firstNumber, secondNumber) - Math.min(firstNumber, secondNumber)));
    }
}
