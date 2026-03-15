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
    console.log("\n");
    activeMenu = await activeMenu.parseInput(line);
    await activeMenu.render();
  }
}
