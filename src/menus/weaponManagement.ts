import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import AddWeapon from "./addWeapon";
import WeaponMenu from "./weaponMenu";

export default async function WeaponManagement(
  db: SQL,
  hunter_name: string,
): Promise<Menu> {
  const weapons =
    await db`select * from HunterWeapon where hunter_name = ${hunter_name}`;

  if (!weapons.length) {
    console.log(`No weapons for ${hunter_name}`);

    return AddWeapon(db, null, null, hunter_name);
  }

  return {
    parseInput(line: string): Promise<Menu> {
      if (line === "0") {
        return AddWeapon(db, null, null, hunter_name);
      }

      const weapon = weapons[Number(line) - 1];

      if (!weapon) {
        return WeaponManagement(db, hunter_name);
      }

      return WeaponMenu(db, weapon.id, hunter_name);
    },
    async render() {
      console.log(`${hunter_name}'s Weapons:`);
      console.log(`0. Add Weapon`);

      console.group();

      for (let i = 0; i < weapons.length; i++) {
        console.log(`${i + 1}. ${weapons[i].class} ${weapons[i].element}`);
      }
      console.groupEnd();
    },
  };
}
