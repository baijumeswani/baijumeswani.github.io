import type { TerminalContextType, CommandOutput } from './terminal';

export type CommandHandler = (args: string[], ctx: TerminalContextType) => CommandOutput | Promise<CommandOutput>;

export interface Command {
  description: string;
  execute: CommandHandler;
  hidden?: boolean;
}

export type CommandRegistry = Map<string, Command>;
