import type { SQL } from "bun";
import type { Menu } from "../menuManager";
import WeaponManagement from "./weaponManagement";

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

    await db`insert into HunterWeapon (hunter_name, class, element) values (${hunter_name}, ${selectedClass}, ${selectedElement})`;

    console.group();
    console.log("Weapon added successfully! ✅");
    console.groupEnd();
    console.log("Going back to weapon management menu...\n");

    return WeaponManagement(db, hunter_name);
  }

  return {
    parseInput(line: string): Promise<Menu> {
      if (!selectedClass) {
        const newWeaponClass = weaponClasses[Number(line) - 1];

        if (!newWeaponClass) {
          console.log(
            "Capcom hasn't released that weapon class yet. Wait for MH Modern Warfare III",
          );
          return AddWeapon(db, null, null, hunter_name);
        }

        return AddWeapon(db, newWeaponClass.class, null, hunter_name);
      }

      if (!selectedElement) {
        const newWeaponElement = weaponElements[Number(line) - 1];

        if (!newWeaponElement) {
          console.log(
            "Capcom hasn't released that element yet. Wait for MH Ultramoon",
          );
          return AddWeapon(db, selectedClass, null, hunter_name);
        }

        return AddWeapon(
          db,
          selectedClass,
          weaponElements[Number(line) - 1].element,
          hunter_name,
        );
      }

      return AddWeapon(db, selectedClass, selectedElement, hunter_name);
    },
    async render() {
      if (!selectedClass) {
        console.log("Which Weapon Class?:");
        for (let i = 0; i < weaponClasses.length; i++) {
          console.log(`${i + 1}. ${weaponClasses[i].class}`);
        }

        return;
      }

      if (!selectedElement) {
        console.log("Which Element?:");
        for (let i = 0; i < weaponElements.length; i++) {
          console.log(`${i + 1}. ${weaponElements[i].element}`);
        }
      }
    },
  };
}
