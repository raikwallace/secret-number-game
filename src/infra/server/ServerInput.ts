import Input from "../../services/Input";

export default class ServerInput implements Input {
    private inputs: string[] = [];

    async getInput(msg: string): Promise<string> {
        const input = this.inputs.shift();
        if (input === undefined) {
            throw new Error("No input available");
        }
        return input;
    }

    setInput(input: string): void {
        this.inputs.push(input);
    }
}
