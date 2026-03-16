import { SQL } from "bun";
import { DeleteWeapon } from "./deleteWeapon";
import RollsManagement from "./rollsManagement";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import type { Menu } from "../types/Menu";

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
    async render(renderer) {
      renderer.line(weapon.name);
      renderer.table(menuOptions.menu);
    },
  };
}
