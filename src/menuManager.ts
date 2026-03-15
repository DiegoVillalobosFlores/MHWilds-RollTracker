import type { SQL } from "bun";
import MainMenu from "./menus/mainMenu";

export type Menu = {
  parseInput(line: string): Promise<Menu>;
  render(): Promise<void>;
};

export default async function MenuManager(db: SQL) {
  let activeMenu = await MainMenu(db);
  let backMenus: Array<Menu> = [];

  await activeMenu.render();
  console.log("\ngg: Exit");
  for await (const line of console) {
    if (line.trim() !== "gg") {
      backMenus.push(activeMenu);
      activeMenu = await activeMenu.parseInput(line);
    }
    if (line.trim() === "gg") {
      if (!backMenus.length) {
        console.log("\nGoodbye!");
        process.exit(0);
      }
      activeMenu = backMenus.pop()!;
    }
    console.log("\n");
    await activeMenu.render();
    console.log(backMenus.length ? "\ngg: Back" : "\ngg: Exit");
  }
}
