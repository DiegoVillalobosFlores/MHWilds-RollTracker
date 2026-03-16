import type { SQL } from "bun";
import WeaponManagement from "./weaponManagement";
import DeleteHunter from "./deleteHunter";
import RollsManagement from "./rollsManagement";
import HunterManagement from "./hunterManagement";
import MainMenu from "./mainMenu";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import type { Menu } from "../types/Menu";

export default async function HunterMenu(
  db: SQL,
  hunter_name: string,
): Promise<Menu> {
  const hunterWeapons =
    await db`select * from HunterWeapon where hunter_name = ${hunter_name}`;

  await db`update Hunter set isLastUsed = true where name = ${hunter_name}`;

  const menuOptions = formatMenuOptions([
    {
      command: "r",
      displayLabel: `${hunter_name}'s rolls`,
      action: () =>
        RollsManagement(
          db,
          hunterWeapons.map((w) => w.id),
          hunter_name,
        ),
    },
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
    {
      command: "delete",
      displayLabel: `Delete ${hunter_name}`,
      action: () => DeleteHunter(db, hunter_name),
    },
  ]);

  return {
    parseInput(line: string): Promise<Menu> {
      const action = menuOptions.handler[line];

      if (!action) return HunterMenu(db, hunter_name);

      return action();
    },
    async render(renderer): Promise<void> {
      renderer.line(`Managing hunter ${hunter_name}`);
      renderer.table(menuOptions.menu);
    },
  };
}
