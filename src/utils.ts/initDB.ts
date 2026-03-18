import { SQL } from "bun";

export default async function initDb() {
  const sqliteDir = process.env.SQLITE_DIR;

  if (!sqliteDir) {
    throw new Error("SQLITE_DIR environment variable is not set");
  }

  const sqlDirInit = Bun.file(`${sqliteDir}/init.txt`);

  await sqlDirInit.write("");

  const db = new SQL({
    adapter: "sqlite",
    filename: `${sqliteDir}/rollTracker.wilds`,
  });

  await db`PRAGMA foreign_keys = ON;`;
  await db`PRAGMA journal_mode = WAL;`;
  await db.file("./src/migrations/1.sql");

  console.log("Database initialized successfully ✅");

  return db;
}
