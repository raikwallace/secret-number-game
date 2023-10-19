import Output from "../../services/Output";

const figlet = require("figlet");

export default class ConsoleOutput implements Output{
    constructor() {}

    public showMessage(message: string): void {
        console.log(message);
    }

    public showImportantMessage(message: string): void {
        console.log(figlet.textSync(message, { 
            font:  'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }));
    }
}
