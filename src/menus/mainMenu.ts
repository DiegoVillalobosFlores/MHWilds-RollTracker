import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import HunterManagement from "./hunterManagement";
import RollsManagement from "./rollsManagement";

export default async function MainMenu(dbClient: SQL): Promise<Menu> {
  const lastUsedHunter = await dbClient`
    select name from Hunter
    where isLastUsed = true
  `;

  return {
    async parseInput(line: string): Promise<Menu> {
      if (line.includes("1")) {
        return HunterManagement(dbClient);
      }

      if (line.includes("2")) {
        const weaponIDs = await dbClient`
          select id from HunterWeapon
          where hunter_name = ${lastUsedHunter[0].name}
        `;

        const ids = weaponIDs.map((row: { id: number }) => row.id);

        return RollsManagement(dbClient, ids);
      }

      console.log("\nInvalid choice. Please try again.");
      return MainMenu(dbClient);
    },
    async render(): Promise<void> {
      console.log("\nWhat do you want to do?");
      console.group();
      console.log("1: Manage Hunters");
      if (lastUsedHunter.length > 0) {
        console.log(`2: View ${lastUsedHunter[0].name}'s Rolls`);
      }
      console.groupEnd();
    },
  };
}
