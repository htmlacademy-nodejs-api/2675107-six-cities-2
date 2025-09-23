export interface Command {
  getName(): string;
  execute(...params: string[]): void;
}
