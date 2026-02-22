import type { CommandRegistry, CommandHandler } from '../types/commands';

export const commandRegistry: CommandRegistry = new Map();

export function registerCommand(name: string, description: string, execute: CommandHandler) {
  commandRegistry.set(name, { description, execute });
}