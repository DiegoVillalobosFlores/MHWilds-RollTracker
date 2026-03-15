import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import HunterManagement from "./hunterManagement";
import RollsManagement from "./rollsManagement";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import SettingsMenu from "./settings";

export default async function MainMenu(dbClient: SQL): Promise<Menu> {
  const lastUsedHunter = await dbClient`
    select name from Hunter
    where isLastUsed = true
    limit 1
  `;

  const settings = await dbClient`select * from settings limit 1`;

  const menuOptions = formatMenuOptions([
    {
      command: "mh",
      displayLabel: "Hunter Manager",
      action: () => HunterManagement(dbClient),
    },
    lastUsedHunter[0]
      ? {
          command: "r",
          displayLabel: `View ${lastUsedHunter[0].name} Rolls`,
          action: () => RollsManagement(dbClient, null, lastUsedHunter[0].name),
        }
      : null,
    {
      command: "s",
      displayLabel: "Settings",
      action: () =>
        SettingsMenu(
          dbClient,
          false,
          settings[0].clear_console_on_render === 1,
        ),
    },
    {
      command: "gg",
      displayLabel: "Exit",
      action: () => {
        console.log("Goodbye!");
        dbClient.close();
        process.exit(0);
      },
    },
  ]);

  return {
    async parseInput(line: string): Promise<Menu> {
      const action = menuOptions.handler[line];

      if (!action) return MainMenu(dbClient);

      return action();
    },
    async render(): Promise<void> {
      console.log("\nWhat do you want to do?");
      console.group();
      console.table(menuOptions.menu);
      console.groupEnd();
    },
  };
}
