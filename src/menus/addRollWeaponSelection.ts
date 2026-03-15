import { sql, type SQL } from "bun";
import type { Menu } from "../menuManager";
import AddRoll from "./addRoll";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import MainMenu from "./mainMenu";
import HunterManagement from "./hunterManagement";
import HunterMenu from "./hunterMenu";
import WeaponManagement from "./weaponManagement";

export default async function AddRollWeaponSelection(
  db: SQL,
  weaponIDs: Array<number>,
  hunter_name: string,
): Promise<Menu> {
  if (weaponIDs.length === 1) {
    const onlyWeaponId = weaponIDs.at(0);

    if (onlyWeaponId) {
      return AddRoll(db, onlyWeaponId, null, null, hunter_name);
    }
  }

  const weapons = await db`
    select * from HunterWeapon
    where id in ${sql(weaponIDs)}`;

  const menuOptions = formatMenuOptions([
    ...weapons.map((weapon) => ({
      command:
        `${weapon.element.substring(0, 1)}${weapon.class.substring(0, 3)}${weapon.id}`.toLocaleLowerCase(),
      displayLabel: `${weapon.name}`,
      action: () => AddRoll(db, weapon.id, null, null, hunter_name),
    })),
    {
      command: "wm",
      displayLabel: `${hunter_name}'s Weapons`,
      action: () => WeaponManagement(db, hunter_name),
    },
    {
      command: "hm",
      displayLabel: `${hunter_name}'s Menu`,
      action: () => HunterMenu(db, hunter_name),
    },
    {
      command: "hsm",
      displayLabel: `Hunter Management Menu`,
      action: () => HunterManagement(db),
    },
    {
      command: "mm",
      displayLabel: `Main Menu`,
      action: () => MainMenu(db),
    },
  ]);

  return {
    parseInput: async (line: string) => {
      const option = menuOptions.handler[line];

      if (!option) {
        return AddRollWeaponSelection(db, weaponIDs, hunter_name);
      }
      return option();
    },
    render: async () => {
      console.log("Add roll for which weapon?");
      console.table(menuOptions.menu);
    },
  };
}
