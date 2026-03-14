import { sql, type SQL } from "bun";
import type { Menu } from "../menuManager";
import AddRoll from "./addRoll";
import AddRollWeaponSelection from "./addRollWeaponSelection";

export default async function RollsManagement(
  db: SQL,
  weaponIDs: Array<number>,
): Promise<Menu> {
  const rolls = await db`
    select r.hunter_weapon_id, class, element, hunter_weapon_ability_group_skill as "Skill Group", hunter_weapon_ability_set_bonus as "Set Bonus" from HunterWeaponRoll r
    join HunterWeapon hw on r.hunter_weapon_id = hw.id
    where r.hunter_weapon_id in (${weaponIDs})`;

  if (!rolls.length) {
    return AddRollWeaponSelection(db, weaponIDs);
  }

  return {
    parseInput: async (line: string) => {
      if (line === "0") {
        return AddRollWeaponSelection(db, weaponIDs);
      }

      return RollsManagement(db, weaponIDs);
    },
    render: async () => {
      console.log("Rolls:");
      console.log("0: Add Roll");
      console.group();
      // console.log("Weapon: \t | Skill Group: \t | Set Bonus: ");
      // for (const roll of rolls) {
      //   console.log(
      //     `${roll.element} ${roll.class} \t | ${roll.hunter_weapon_ability_group_skill} \t | ${roll.hunter_weapon_ability_set_bonus}`,
      //   );
      // }
      console.table(rolls);
      console.groupEnd();
    },
  };
}
