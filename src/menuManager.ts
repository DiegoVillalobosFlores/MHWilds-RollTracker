import type { SQL } from "bun";
import MainMenu from "./menus/mainMenu";

export type Menu = {
  parseInput(line: string): Promise<Menu>;
  render(): Promise<void>;
};

export default async function MenuManager(db: SQL) {
  let activeMenu = await MainMenu(db);

  await activeMenu.render();
  for await (const line of console) {
    const settings = await db`select * from settings limit 1`;
    console.log("\n");
    if (settings[0].clear_console_on_render === 1) {
      console.clear();
    }
    activeMenu = await activeMenu.parseInput(line);
    await activeMenu.render();
  }
}
