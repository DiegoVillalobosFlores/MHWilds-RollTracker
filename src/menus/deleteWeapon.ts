import { SQL } from "bun";
import WeaponMenu from "./weaponMenu";
import WeaponManagement from "./weaponManagement";
import type { Menu } from "../types/Menu";

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
        console.log(`Aight bet, deleting ${weapon.name}`);
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
    async render(renderer) {
      renderer.line(`${weapon.name}`);
      renderer.line(`Hey bruh, u shuh?`);
      renderer.line("1: Ay m8, delete that shit fam");
      renderer.line("2: Nah bro, I was tripin, mb");
    },
  };
}
