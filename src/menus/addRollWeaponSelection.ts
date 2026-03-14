import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import AddRoll from "./addRoll";

export default async function AddRollWeaponSelection(
  db: SQL,
  weaponIDs: Array<number>,
): Promise<Menu> {
  const weapons = await db`
    select * from HunterWeapon
    where id in (${weaponIDs})`;

  return {
    parseInput: async (line: string) => {
      const weapon = weapons[parseInt(line.trim()) - 1];

      if (!weapon) {
        return AddRollWeaponSelection(db, weaponIDs);
      }
      return AddRoll(db, weapon.id, null, null);
    },
    render: async () => {
      console.log("No rolls found");
      console.log("Add roll for which weapon?");
      for (let i = 0; i < weapons.length; i++) {
        console.log(`${i + 1}: ${weapons[i].class} ${weapons[i].element}`);
      }
    },
  };
}
