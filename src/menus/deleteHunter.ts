import type { SQL } from "bun";
import HunterMenu from "./hunterMenu";
import type { Menu } from "../menuManager";
import HunterManagement from "./hunterManagement";

export default async function DeleteHunter(
  db: SQL,
  hunter_name: string,
): Promise<Menu> {
  const backMenu = await HunterMenu(db, hunter_name);

  return {
    async parseInput(line: string): Promise<Menu> {
      if (line === "1") {
        console.log(`Aight bet, deleting ${hunter_name}`);
        await db`delete from Hunter where name = ${hunter_name}`;
        return HunterManagement(db);
      }

      if (line === "2") {
        console.log(`Bro... why u waste us time cuh?`);
        return backMenu;
      }

      console.log("You ok bro?");
      return DeleteHunter(db, hunter_name);
    },
    async render(): Promise<void> {
      console.log(`${hunter_name}`);
      console.log(`Hey bruh, u shuh?`);
      console.log("1: Ay m8, delete that shit fam");
      console.log("2: Nah bro, I was tripin, mb");
    },
  };
}
