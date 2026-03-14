import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import HunterMenu from "./hunterMenu";
import AddHunter from "./addHunter";

export default async function HunterManagement(db: SQL): Promise<Menu> {
  const hunters = await db`select * from Hunter`;

  if (hunters.length === 0) {
    return AddHunter(db);
  }

  return {
    parseInput(line: string): Promise<Menu> {
      const selectedHunter = hunters[+line - 1];

      if (!selectedHunter) {
        return HunterManagement(db);
      }

      return HunterMenu(db, selectedHunter.name);
    },
    async render(): Promise<void> {
      console.log("Which hunter do you want to manage?");
      console.group();
      for (let i = 1; i <= hunters.length; i++) {
        console.log(`${i}: ${hunters[i - 1].name}`);
      }
      console.groupEnd();
    },
  };
}
