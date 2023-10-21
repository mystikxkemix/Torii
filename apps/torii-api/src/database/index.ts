import fs from "fs/promises";
import path from "path";
import { Sequelize, SyncOptions } from "sequelize";
import RssFeed, { init as initRssFeed } from "./rss-feed";

export const DataFolder = process.env.DATA_PATH ?? "./data";
const folderPath = path.join(DataFolder, "databases");
const filePath = path.join(folderPath, "database.sqlite");

let sequelize: Sequelize;

async function connect() {
  await setupDatabase();
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: filePath,
  });

  await initRssFeed(sequelize);
}

async function sync(options?: SyncOptions) {
  return await sequelize.sync(options);
}

async function setupDatabase() {
  try {
    await fs.stat(folderPath);
  } catch (e) {
    console.log(e);
    await fs.mkdir(folderPath, { recursive: true });
    console.log("Created folders", folderPath);
  }

  try {
    await fs.stat(filePath);
  } catch (e) {
    await fs.writeFile(filePath, "");
    console.log("Created file", filePath);
  }
}

export default {
  connect,
  sync,
  models: {
    RssFeed,
  },
};
