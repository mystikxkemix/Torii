import Parser from "rss-parser";
import { DataTypes, Model, Sequelize } from "sequelize";

export type RssFeedDataOptions = {
  name: string;
  url: string;
  delayNumber: number;
  delayUnit: DelayUnit;
};

class RssFeedData extends Model {
  declare id: number;
  declare name: string;
  declare url: string;
  declare lastFetch?: Date;
  declare delayNumber: number;
  declare delayUnit: DelayUnit;
  declare enabled: boolean;
  private _parser: Parser;
  private _refetch?: NodeJS.Timeout;

  constructor() {
    super();
    this._parser = new Parser();
  }

  public static new(options: RssFeedDataOptions) {
    const newData = new RssFeedData();
    newData.name = options.name;
    newData.url = options.url;
    newData.delayNumber = options.delayNumber;
    newData.delayUnit = options.delayUnit;
    newData.enabled = true;

    return newData;
  }

  static async updateRssFeed(
    id: number,
    rssFeedData: Partial<Omit<RssFeedData, "id">>
  ) {
    try {
      const feed = await this.findByPk(id);
      if (feed) {
        await feed.update(rssFeedData);
        return feed;
      }
      throw new Error("RssFeed not found");
    } catch (error) {
      throw new Error(`Error updating RssFeed: ${error.message}`);
    }
  }

  static async deleteRssFeed(feedId: number) {
    try {
      const feed = await this.findByPk(feedId);
      if (feed) {
        await feed.destroy();
        return feed;
      }
      throw new Error("RssFeed not found");
    } catch (error) {
      throw new Error(`Error deleting RssFeed: ${error.message}`);
    }
  }

  public async fetch(noDownload = false) {
    if (noDownload === false) {
      const feed = await this._parser.parseURL(this.url);
      let items = feed.items;
      if (this.lastFetch)
        items = feed.items.filter((i) => new Date(i.isoDate) > this.lastFetch);

      // START TORRENT WITH ITEMS
      console.log(this.name, "Fetch those items", items);
    }

    this.lastFetch = new Date();
    await this.save();

    this.startDelay();
  }

  public async toggleEnable(enable: boolean) {
    if (this.enabled === enable) return;

    this.enabled = enable;
    if (enable === false && this._refetch) {
      clearTimeout(this._refetch);
    }

    await this.save();
  }

  private startDelay() {
    const delayTime = convertDelayUnit(this.delayUnit) * this.delayNumber;
    this._refetch = setTimeout(() => {
      this.fetch();
    }, delayTime);
  }
}

export enum DelayUnit {
  hours,
  minutes,
  seconds,
}

export function convertDelayUnit(delayUnit: DelayUnit): number {
  switch (delayUnit.toString()) {
    case "hours":
      return 60 * 60 * 1000;
    case "minutes":
      return 60 * 1000;
    case "seconds":
      return 1000;
  }

  return 0;
}

export async function init(sequelize: Sequelize) {
  RssFeedData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      delayNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delayUnit: {
        type: DataTypes.ENUM,
        values: ["hours", "minutes", "seconds"],
        allowNull: false,
      },
      lastFetch: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { sequelize, modelName: "RssFeedData" }
  );
  console.log("init", RssFeedData);
  await RssFeedData.sync({ alter: true });
}

export default RssFeedData;
