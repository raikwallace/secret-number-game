export default interface Input {
    getInput(msg: string): Promise<string>;
}
