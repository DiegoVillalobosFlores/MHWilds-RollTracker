import type { SQL } from "bun";
import HunterMenu from "./hunterMenu";
import AddHunter from "./addHunter";
import MainMenu from "./mainMenu";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import type { Menu } from "../types/Menu";

export default async function HunterManagement(db: SQL): Promise<Menu> {
  const hunters = await db`select * from Hunter`;

  if (hunters.length === 0) {
    console.error("No hunters found. Adding a new hunter");
    return AddHunter(db);
  }

  const menuOptions = formatMenuOptions([
    ...hunters.map((hunter) => ({
      command: hunter.name.substring(0, 3).toLowerCase(),
      displayLabel: hunter.name,
      action: () => HunterMenu(db, hunter.name),
    })),
    { command: "ah", displayLabel: "Add Hunter", action: () => AddHunter(db) },
    { command: "mm", displayLabel: "Main Menu", action: () => MainMenu(db) },
  ]);

  return {
    parseInput(line: string): Promise<Menu> {
      const action = menuOptions.handler[line];

      if (!action) {
        return HunterManagement(db);
      }

      return action();
    },
    async render(renderer): Promise<void> {
      renderer.line("Which hunter do you want to manage?");
      renderer.table(menuOptions.menu);
    },
  };
}
