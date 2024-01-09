import Input from "../../services/Input";
import * as readline from 'readline';


export default class ConsoleInput implements Input{
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor() {}

    public async getInput(msg: string): Promise<string> {
        return await this.readLineAsync(msg);
    }

    private async readLineAsync(msg: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(msg, (answer) => {
                resolve(answer);
            });
        });
    }
    
    public close(): void {
        this.rl.close();
    }
}
