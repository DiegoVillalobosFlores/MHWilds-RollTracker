import type { SQL } from "bun";
import MainMenu from "./menus/mainMenu";
import type { Renderer } from "./types/Renderer";
import consoleRenderer from "./utils.ts/consoleRenderer";

export default async function MenuManager(
  db: SQL,
  renderer: Renderer = consoleRenderer,
) {
  let activeMenu = await MainMenu(db);

  await activeMenu.render(renderer);
  for await (const line of console) {
    const settings = await db`select * from settings limit 1`;
    console.log("\n");
    if (settings[0].clear_console_on_render === 1) {
      console.clear();
    }
    activeMenu = await activeMenu.parseInput(line);
    await activeMenu.render(renderer);
  }
}
