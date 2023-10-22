import Output from "../../services/Output";

export default class ServerOutput implements Output {
    private outputs: string[] = [];
    showMessage(message: string): void {
        this.outputs.push(message);
    }
    showImportantMessage(message: string): void {
        this.outputs.push(message);
    }
    getOutput(): string {
        return this.outputs.shift() || "";
    }
    clearOutput(): void {
        this.outputs = [];
    }
}
