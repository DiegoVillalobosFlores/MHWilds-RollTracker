import { SQL } from "bun";
import type { Menu } from "../menuManager";
import { DeleteWeapon } from "./deleteWeapon";
import RollsManagement from "./rollsManagement";

export default async function WeaponMenu(
  db: SQL,
  weaponId: number,
  hunter_name: string,
): Promise<Menu> {
  const weapons =
    await db`select * from HunterWeapon where id = ${weaponId} limit 1`;

  const weapon = weapons[0];

  return {
    async parseInput(line: string): Promise<Menu> {
      if (line === "0") {
        return DeleteWeapon(db, weaponId, hunter_name);
      }

      if (line === "1") {
        return await RollsManagement(db, [weaponId]);
      }

      return WeaponMenu(db, weaponId, hunter_name);
    },
    async render() {
      console.log(`${weapon.element} ${weapon.class}`);
      console.group();
      console.log("0: Delete");
      console.log("1: View Rolls");
      console.groupEnd();
    },
  };
}
