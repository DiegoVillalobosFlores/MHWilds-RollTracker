import type { SQL } from "bun";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import MainMenu from "./mainMenu";
import type { Menu } from "../types/Menu";

export default async function SettingsMenu(
  db: SQL,
  save: boolean,
  clearConsoleOnRender: boolean,
): Promise<Menu> {
  const menuOptions = formatMenuOptions([
    {
      command: "cc",
      displayLabel: "Clear Console on Menu Render",
      action: async () => SettingsMenu(db, true, !clearConsoleOnRender),
      additionalInfo: {
        Current: clearConsoleOnRender ? "enabled" : "disabled",
      },
    },
    {
      command: "mm",
      displayLabel: "Main Menu",
      action: async () => MainMenu(db),
    },
  ]);

  if (save) {
    await db`update settings set clear_console_on_render = ${clearConsoleOnRender}`;
  }

  return {
    parseInput: async (line: string) => {
      const option = menuOptions.handler[line];
      if (!option) return SettingsMenu(db, false, clearConsoleOnRender);
      return option();
    },
    render: async (renderer) => {
      renderer.table(menuOptions.menu);
    },
  };
}
