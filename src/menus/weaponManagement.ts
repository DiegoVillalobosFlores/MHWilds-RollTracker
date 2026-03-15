import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import AddWeapon from "./addWeapon";
import WeaponMenu from "./weaponMenu";
import HunterManagement from "./hunterManagement";
import MainMenu from "./mainMenu";
import formatMenuOptions from "../utils.ts/formatMenuOptions";

export default async function WeaponManagement(
  db: SQL,
  hunter_name: string,
): Promise<Menu> {
  const weapons =
    await db`select * from HunterWeapon where hunter_name = ${hunter_name}`;

  if (!weapons.length) {
    console.error(`${hunter_name} has no weapons. Adding a new weapon...`);

    return AddWeapon(db, null, null, hunter_name);
  }

  const menuOptions = formatMenuOptions([
    ...weapons.map((weapon, i) => ({
      command:
        `${weapon.element.substring(0, 1)}${weapon.class.substring(0, 3)}${weapon.id}`.toLocaleLowerCase(),
      displayLabel: weapon.name,
      action: () => WeaponMenu(db, weapon.id, hunter_name),
    })),
    {
      command: "aw",
      displayLabel: "Add Weapon",
      action: () => AddWeapon(db, null, null, hunter_name),
    },
    {
      command: "hm",
      displayLabel: `${hunter_name}'s Management Menu`,
      action: () => WeaponManagement(db, hunter_name),
    },
    {
      command: "hsm",
      displayLabel: "Hunter Management Menu",
      action: () => HunterManagement(db),
    },
    { command: "mm", displayLabel: "Main Menu", action: () => MainMenu(db) },
  ]);

  return {
    parseInput(line: string): Promise<Menu> {
      const option = menuOptions.handler[line];
      if (!option) {
        return WeaponManagement(db, hunter_name);
      }

      return option();
    },
    async render() {
      console.log(`${hunter_name}'s Weapons:`);
      console.group();
      console.table(menuOptions.menu);
      console.groupEnd();
    },
  };
}
