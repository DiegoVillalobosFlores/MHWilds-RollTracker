import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import WeaponManagement from "./weaponManagement";
import formatMenuOptions from "../utils.ts/formatMenuOptions";
import MainMenu from "./mainMenu";
import HunterMenu from "./hunterMenu";

export default async function AddWeapon(
  db: SQL,
  selectedClass: string | null,
  selectedElement: string | null,
  hunter_name: string,
): Promise<Menu> {
  const weaponClasses = await db`select * from WeaponClass`;
  const weaponElements = await db`select * from WeaponElement`;

  if (selectedClass && selectedElement) {
    console.log(
      `Adding ${selectedElement} ${selectedClass} ${hunter_name} weapon...`,
    );

    await db`insert into HunterWeapon (hunter_name, class, element, name) values (${hunter_name}, ${selectedClass}, ${selectedElement}, ${selectedElement + " " + selectedClass})`;

    console.group();
    console.log("Weapon added successfully! ✅");
    console.groupEnd();
    console.log("Going back to weapon management menu...\n");

    return WeaponManagement(db, hunter_name);
  }

  const options = [
    {
      displayLabel: `${hunter_name}'s Weapons`,
      command: "hw",
      action: () => WeaponManagement(db, hunter_name),
    },
    {
      displayLabel: `${hunter_name}'s Menu`,
      command: "mm",
      action: () => HunterMenu(db, hunter_name),
    },
    {
      displayLabel: `Main Menu`,
      command: "mm",
      action: () => MainMenu(db),
    },
  ];

  const classMenuOptions = formatMenuOptions([
    ...weaponClasses.map((weaponClass, i) => ({
      displayLabel: weaponClass.class,
      command: weaponClass.class.substring(0, 3).toLowerCase(),
      action: () => AddWeapon(db, weaponClass.class, null, hunter_name),
    })),
    ...options,
  ]);

  const elementMenuOptions = formatMenuOptions([
    ...weaponElements.map((weaponElement, i) => ({
      displayLabel: weaponElement.element,
      command: weaponElement.element.substring(0, 1).toLowerCase(),
      action: () =>
        AddWeapon(db, selectedClass, weaponElement.element, hunter_name),
    })),
    ...options,
  ]);

  return {
    parseInput(line: string): Promise<Menu> {
      const option = !selectedClass
        ? classMenuOptions.handler[line]
        : elementMenuOptions.handler[line];

      if (!option) {
        return AddWeapon(db, selectedClass, selectedElement, hunter_name);
      }

      return option();
    },
    async render() {
      if (!selectedClass) {
        console.log("Which Weapon Class?:");
        console.table(classMenuOptions.menu);

        return;
      }

      if (!selectedElement) {
        console.log("Which Element?:");
        console.table(elementMenuOptions.menu);
      }
    },
  };
}
