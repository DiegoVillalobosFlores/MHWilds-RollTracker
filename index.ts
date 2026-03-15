import { SQL } from "bun";
import MenuManager from "./src/menuManager";

const initDb = async () => {
  const sqliteDir = "./sqlite";

  const sqlDirInit = Bun.file(`${sqliteDir}/init.txt`);

  await sqlDirInit.write("");

  const db = new SQL({
    adapter: "sqlite",
    filename: `${sqliteDir}/rollTracker.wilds`,
  });

  try {
    await db`PRAGMA foreign_keys = ON;`;
    await db`PRAGMA journal_mode = WAL;`;
    await db.file("./src/migrations/1.sql");
  } catch (e) {
    console.error(e);
  }

  console.log("Database initialized successfully ✅");

  return db;
};

const main = async () => {
  console.log("Welcome to the tracker!");

  console.log("\nInitializing Database...");

  const db = await initDb();

  process.on("SIGINT", () => {
    console.log("\nGoodbye!");
    db.close();
    process.exit();
  });

  await MenuManager(db);
};

main();

/*
- arma1 arma2 arma3
 1- x    x     x
 2- x    x     y
 3- x    x     x
 4- x    y     x
 5- y    x     x
*/
