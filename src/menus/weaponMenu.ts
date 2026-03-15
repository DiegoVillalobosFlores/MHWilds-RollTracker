import { SQL } from "bun";
import type { Menu } from "../menuManager";
import { DeleteWeapon } from "./deleteWeapon";
import RollsManagement from "./rollsManagement";
import formatMenuOptions from "../utils.ts/formatMenuOptions";

export default async function WeaponMenu(
  db: SQL,
  weaponId: number,
  hunter_name: string,
): Promise<Menu> {
  const weapons =
    await db`select * from HunterWeapon where id = ${weaponId} limit 1`;

  const weapon = weapons[0];

  const menuOptions = formatMenuOptions([
    {
      command: "r",
      displayLabel: "View Rolls",
      action: () => RollsManagement(db, [weaponId], hunter_name),
    },
    {
      command: "delete",
      displayLabel: `Delete ${weapon.name}`,
      action: () => DeleteWeapon(db, weaponId, hunter_name),
    },
  ]);

  return {
    async parseInput(line: string): Promise<Menu> {
      const option = menuOptions.handler[line];

      if (!option) {
        return WeaponMenu(db, weaponId, hunter_name);
      }

      return option();
    },
    async render() {
      console.log(weapon.name);
      console.group();
      console.table(menuOptions.menu);
      console.groupEnd();
    },
  };
}
