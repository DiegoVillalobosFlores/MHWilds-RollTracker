import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import WeaponManagement from "./weaponManagement";
import DeleteHunter from "./deleteHunter";

export default async function HunterMenu(
  db: SQL,
  hunter_name: string,
): Promise<Menu> {
  const hunter = await db`select * from Hunter where name = ${hunter_name}`;

  await db`update Hunter set isLastUsed = true where name = ${hunter_name}`;

  return {
    parseInput(line: string): Promise<Menu> {
      if (line === "1") {
        return WeaponManagement(db, hunter_name);
      }

      if (line === "0") {
        return DeleteHunter(db, hunter_name);
      }

      return HunterMenu(db, hunter_name);
    },
    async render(): Promise<void> {
      console.log(`Managing hunter ${hunter_name}`);
      console.log(`0: Delete ${hunter_name}`);
      console.group();
      console.log("1: Manage weapons");
      console.groupEnd();
    },
  };
}
