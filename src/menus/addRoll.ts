import type { SQL } from "bun";
import RollsManagement from "./rollsManagement";
import WeaponManagement from "./weaponManagement";
import HunterMenu from "./hunterMenu";
import MainMenu from "./mainMenu";
import WeaponMenu from "./weaponMenu";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import type { Menu } from "../types/Menu";

export default async function AddRoll(
  db: SQL,
  weaponId: number,
  groupSkill: string | null,
  setBonus: number | null,
  hunter_name: string,
): Promise<Menu> {
  const skillGroups = await db`select * from HunterWeaponSkillGroup`;

  const setBonuses = await db`select * from HunterWeaponSetBonus`;

  const weapon =
    await db`select * from HunterWeapon where id = ${weaponId} limit 1`;

  if (groupSkill && setBonus) {
    console.log(
      `Adding ${groupSkill} ${setBonus} as roll for ${weapon[0].element} ${weapon[0].class}...`,
    );

    await db`insert into HunterWeaponRoll (hunter_weapon_id, hunter_weapon_ability_group_skill, hunter_weapon_ability_set_bonus) values (${weaponId}, ${groupSkill}, ${setBonus})`;

    console.group();
    console.log("Weapon added successfully! ✅");
    console.groupEnd();
    console.log(
      `Going back to ${weapon[0].element} ${weapon[0].class}'s rolls management menu...\n`,
    );

    return RollsManagement(db, [weaponId], weapon[0].hunter_name);
  }

  const options = [
    {
      displayLabel: `${weapon[0].name}'s Menu`,
      command: "wm",
      action: () => WeaponMenu(db, weaponId, hunter_name),
    },
    {
      displayLabel: `${hunter_name}'s Weapons`,
      command: "hw",
      action: () => WeaponManagement(db, hunter_name),
    },
    {
      displayLabel: `${hunter_name}'s Menu`,
      command: "mm",
      action: () => HunterMenu(db, hunter_name),
    },
    {
      displayLabel: `Main Menu`,
      command: "mm",
      action: () => MainMenu(db),
    },
  ];

  const groupSkillMenuOptions = formatMenuOptions([
    ...skillGroups.map((group) => ({
      displayLabel: group.name,
      command: group.name
        .split(" ")
        .reduce((acc, word) => acc + word.substring(0, 2).toLowerCase(), ""),
      action: () => AddRoll(db, weaponId, group.name, setBonus, hunter_name),
    })),
    ...options,
  ]);

  const setBonusesMenuOptions = formatMenuOptions([
    ...setBonuses.map((bonus) => ({
      displayLabel: bonus.name,
      command: bonus.name
        .split(" ")
        .reduce((acc, word) => (acc + word.substring(0, 2)).toLowerCase(), ""),
      action: () => AddRoll(db, weaponId, groupSkill, bonus.name, hunter_name),
    })),
    ...options,
  ]);

  return {
    parseInput: async (line) => {
      const option = !groupSkill
        ? groupSkillMenuOptions.handler[line.trim()]
        : setBonusesMenuOptions.handler[line.trim()];

      if (!option) {
        console.log("Yeah ok buddy whatever, learn to read lmao");

        return AddRoll(db, weaponId, groupSkill, setBonus, hunter_name);
      }

      return option();
    },
    render: async (renderer) => {
      if (!groupSkill) {
        renderer.line("Skill Group:");
        renderer.table(groupSkillMenuOptions.menu);

        return;
      }

      if (!setBonus) {
        renderer.line(`Group Skill: ${groupSkill}, Set Bonus:`);
        renderer.table(setBonusesMenuOptions.menu);

        return;
      }
    },
  };
}
