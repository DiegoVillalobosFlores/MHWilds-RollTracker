import { SQL } from "bun";
import type { Menu } from "../menuManager";
import WeaponMenu from "./weaponMenu";
import WeaponManagement from "./weaponManagement";

export async function DeleteWeapon(
  db: SQL,
  weaponId: number,
  hunter_name: string,
): Promise<Menu> {
  const weapons = await db`select * from HunterWeapon where id = ${weaponId}`;
  const weapon = weapons[0];

  const backMenu = await WeaponMenu(db, weaponId, hunter_name);

  return {
    async parseInput(line: string): Promise<Menu> {
      if (line === "1") {
        console.log(`Aight bet, deleting ${weapon.element} ${weapon.class}`);
        await db`delete from HunterWeapon where id = ${weaponId}`;
        return WeaponManagement(db, hunter_name);
      }

      if (line === "2") {
        console.log(`Bro... why u waste us time cuh?`);
        return backMenu;
      }

      console.log("You ok bro?");
      return DeleteWeapon(db, weaponId, hunter_name);
    },
    async render() {
      console.log(`${weapon.element} ${weapon.class}`);
      console.log(`Hey bruh, u shuh?`);
      console.log("1: Ay m8, delete that shit fam");
      console.log("2: Nah bro, I was tripin, mb");
    },
  };
}
