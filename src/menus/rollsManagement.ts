import { sql, type SQL } from "bun";
import AddRollWeaponSelection from "./addRollWeaponSelection";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import HunterMenu from "./hunterMenu";
import WeaponManagement from "./weaponManagement";
import HunterManagement from "./hunterManagement";
import MainMenu from "./mainMenu";
import AddRoll from "./addRoll";
import AddWeapon from "./addWeapon";
import type { Menu } from "../types/Menu";

export default async function RollsManagement(
  db: SQL,
  filteredWeaponIDs: Array<number> | null,
  hunter_name: string,
): Promise<Menu> {
  const hunterWeapons =
    await db`select * from HunterWeapon where hunter_name = ${hunter_name}`;

  if (hunterWeapons.length === 0) {
    console.error(`${hunter_name} has no weapons, adding a new weapon`);
    return AddWeapon(db, null, null, hunter_name);
  }

  const hunterWeaponIDs = filteredWeaponIDs
    ? filteredWeaponIDs
    : hunterWeapons.map((w) => w.id);

  const rolls = await db`
    select r.hunter_weapon_id, class, element, hunter_weapon_ability_group_skill as "Skill Group", hunter_weapon_ability_set_bonus as "Set Bonus" from HunterWeaponRoll r
    join HunterWeapon hw on r.hunter_weapon_id = hw.id
    where r.hunter_weapon_id in ${sql(hunterWeaponIDs)} order by r.created_at`;

  if (!rolls.length) {
    console.error(`No weapon rolls found, adding a new roll`);
    return AddRollWeaponSelection(db, hunterWeaponIDs, hunter_name);
  }

  const filteredWeapons = hunterWeaponIDs.reduce(
    (acc, weapon) => {
      acc.push(hunterWeapons.find((w) => w.id === weapon));
      return acc;
    },
    [] as Array<{ id: number; element: string; class: string; name: string }>,
  );

  const menuOptions = formatMenuOptions([
    ...filteredWeapons.map((weapon) => ({
      command: `aw${weapon.id}`,
      displayLabel: `Add Roll to Weapon ${weapon.id}`,
      action: () => AddRoll(db, weapon.id, null, null, hunter_name),
      additionalInfo: {
        Weapon: `${weapon.id} ${weapon.name}`,
      },
    })),
    filteredWeaponIDs && hunterWeapons.length !== filteredWeaponIDs.length
      ? {
          command: "r",
          displayLabel: `All ${hunter_name} Rolls`,
          action: () =>
            RollsManagement(
              db,
              hunterWeapons.map((w) => w.id),
              hunter_name,
            ),
        }
      : null,
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

  const formattedRolls = rolls.reduce((acc, roll) => {
    const weaponProperty = `${roll.element} ${roll.class} ${roll.hunter_weapon_id}`;
    const rollName = `${roll["Skill Group"]} ${roll["Set Bonus"]}`;

    for (let i = 0; i < acc.length; i++) {
      if (!acc[i][weaponProperty]) {
        acc[i][weaponProperty] = rollName;
        return acc;
      }
    }

    acc.push({
      [weaponProperty]: rollName,
    });
    return acc;
  }, []);

  return {
    parseInput: async (line: string) => {
      const action = menuOptions.handler[line];

      if (!action) return RollsManagement(db, filteredWeaponIDs, hunter_name);

      return action();
    },
    render: async (renderer) => {
      if (filteredWeaponIDs && hunterWeaponIDs.length === 1) {
        renderer.line(`${hunter_name}'s ${filteredWeapons[0]?.name} Rolls:`);
      }

      if (
        !filteredWeaponIDs ||
        filteredWeaponIDs.length === hunterWeapons.length
      ) {
        renderer.line(`${hunter_name}'s Rolls:`);
      }
      renderer.table(formattedRolls);
      renderer.table(menuOptions.menu);
    },
  };
}
