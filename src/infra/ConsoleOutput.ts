const figlet = require("figlet");

class ConsoleOutput implements Output{
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
