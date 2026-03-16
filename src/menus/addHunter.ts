import type { SQL } from "bun";
import HunterManagement from "./hunterManagement";
import type { Menu } from "../types/Menu";

export default async function AddHunter(db: SQL): Promise<Menu> {
  return {
    async parseInput(line: string): Promise<Menu> {
      console.log(`\nAdding hunter ${line}...`);

      await db`insert into Hunter (name) values (${line});`;

      console.log(`${line} added as a hunter ✅`);

      return HunterManagement(db);
    },
    async render(renderer): Promise<void> {
      renderer.line("\nName of your hunter:");
    },
  };
}
