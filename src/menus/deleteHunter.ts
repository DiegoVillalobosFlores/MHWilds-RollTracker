import type { SQL } from "bun";
import HunterMenu from "./hunterMenu";
import HunterManagement from "./hunterManagement";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import type { Menu } from "../types/Menu";

export default async function DeleteHunter(
  db: SQL,
  hunter_name: string,
  isConfirmed: boolean,
): Promise<Menu> {
  if (isConfirmed) {
    console.log(`Aight bet, deleting ${hunter_name}`);
    await db`delete from Hunter where name = ${hunter_name}`;
    return HunterManagement(db);
  }

  const menuOptions = formatMenuOptions([
    {
      displayLabel: "Nevermind",
      command: "bruh",
      action: () => HunterMenu(db, hunter_name),
    },
    {
      displayLabel: "Delete Hunter",
      command: "delete",
      action: () => DeleteHunter(db, hunter_name, true),
    },
  ]);

  return {
    async parseInput(line: string): Promise<Menu> {
      const option = menuOptions.handler[line];

      if (!option) {
        console.log("You ok bro?");
        return DeleteHunter(db, hunter_name, false);
      }

      return option();
    },
    async render(renderer): Promise<void> {
      renderer.line(`${hunter_name}`);
      renderer.error(`Hey bruh, u shuh?`);
      renderer.table(menuOptions.menu);
    },
  };
}
