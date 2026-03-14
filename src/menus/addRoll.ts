import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import RollsManagement from "./rollsManagement";

export default async function AddRoll(
  db: SQL,
  weaponId: number,
  groupSkill: string | null,
  setBonus: number | null,
): Promise<Menu> {
  const skillGroups = await db`select * from HunterWeaponSkillGroup`;

  const setBonuses = await db`select * from HunterWeaponSetBonus`;

  const weapon = await db`select * from HunterWeapon where id = ${weaponId}`;

  if (groupSkill && setBonus) {
    console.log(
      `Adding ${groupSkill} ${setBonus} as roll for ${weapon.class} ${weapon.element}...`,
    );

    await db`insert into HunterWeaponRoll (hunter_weapon_id, hunter_weapon_ability_group_skill, hunter_weapon_ability_set_bonus) values (${weaponId}, ${groupSkill}, ${setBonus})`;

    console.group();
    console.log("Weapon added successfully! ✅");
    console.groupEnd();
    console.log("Going back to weapon management menu...\n");

    return RollsManagement(db, [weaponId]);
  }

  return {
    parseInput: async (line) => {
      if (!groupSkill) {
        const skillGroup = skillGroups[parseInt(line.trim()) - 1];

        if (!skillGroup) {
          return AddRoll(db, weaponId, null, setBonus);
        }

        return AddRoll(db, weaponId, skillGroup.name, setBonus);
      }

      if (!setBonus) {
        const setBonus = setBonuses[parseInt(line.trim()) - 1];

        if (!setBonus) {
          return AddRoll(db, weaponId, groupSkill, null);
        }

        return AddRoll(db, weaponId, groupSkill, setBonus.name);
      }

      console.log("Yeah ok buddy whatever, learn to read lmao");
      return AddRoll(db, weaponId, groupSkill, setBonus);
    },
    render: async () => {
      if (!groupSkill) {
        console.log("Skill Group:");
        for (let i = 0; i < skillGroups.length; i++) {
          console.log(`${i + 1}. ${skillGroups[i].name}`);
        }

        return;
      }

      if (!setBonus) {
        console.log("Set Bonus:");
        for (let i = 0; i < setBonuses.length; i++) {
          console.log(`${i + 1}. ${setBonuses[i].name}`);
        }

        return;
      }
    },
  };
}
