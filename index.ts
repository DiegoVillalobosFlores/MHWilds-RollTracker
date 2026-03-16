import MenuManager from "./src/menuManager";
import initDb from "./src/utils.ts/initDB";

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
