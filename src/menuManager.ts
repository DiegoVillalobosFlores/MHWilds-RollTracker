import type { SQL } from "bun";
import MainMenu from "./menus/mainMenu";

export type Menu = {
  parseInput(line: string): Promise<Menu>;
  render(): Promise<void>;
};

export default async function MenuManager(db: SQL) {
  let activeMenu = await MainMenu(db);
  let backMenu: Menu | null = null;

  await activeMenu.render();
  console.log("\ngg: Exit");
  for await (const line of console) {
    if (line.trim() !== "gg") {
      backMenu = activeMenu;
      activeMenu = await activeMenu.parseInput(line);
    }
    if (line.trim() === "gg") {
      if (!backMenu) {
        console.log("\nGoodbye!");
        process.exit(0);
      }
      activeMenu = backMenu;
    }
    console.log("\n");
    await activeMenu.render();
    console.log("\ngg: Back");
  }
}
