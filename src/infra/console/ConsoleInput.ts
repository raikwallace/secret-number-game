import Input from "../../services/Input";
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



export default class ConsoleInput implements Input{
    constructor() {}

    public async getInput(msg: string): Promise<string> {
        return await this.readLineAsync(msg);
    }

    private readLineAsync(msg: string): Promise<string> {
        return new Promise((resolve) => {
            rl.question(msg, (answer) => {
                resolve(answer);
            });
        });
    }
    
    public close(): void {
        rl.close();
    }
}
