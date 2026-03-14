import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import HunterManagement from "./hunterManagement";

export default async function MainMenu(dbClient: SQL): Promise<Menu> {
  return {
    parseInput(line: string): Promise<Menu> {
      if (line.includes("1")) {
        return HunterManagement(dbClient);
      }

      console.log("\nInvalid choice. Please try again.");
      return MainMenu(dbClient);
    },
    async render(): Promise<void> {
      console.log("\nWhat do you want to do?");
      console.group();
      console.log("1: Manage Hunters");
      console.groupEnd();
    },
  };
}
