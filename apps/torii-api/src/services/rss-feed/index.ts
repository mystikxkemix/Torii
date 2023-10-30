import Database from "../../database";
import { RssFeedDataOptions } from "../../database/rss-feed-data";

const RssService = {
  async init() {
    const rssFeedsData = await Database.models.RssFeedData.findAll();

    rssFeedsData.forEach((r) => r.fetch);
  },

  async forceFetch() {
    const rssFeedsData = await Database.models.RssFeedData.findAll();
    rssFeedsData.forEach((r) => r.fetch);
  },

  async createNewOne(insertParams: InsertRssFeed) {
    const newOne = Database.models.RssFeedData.new({
      name: insertParams.name,
      url: insertParams.url,
      delayNumber: insertParams.delayNumber,
      delayUnit: insertParams.delayUnit,
    });

    await newOne.fetch(insertParams.noDownload);
    await newOne.save();

    return newOne;
  },
};

export type InsertRssFeed = RssFeedDataOptions & {
  noDownload: boolean;
};

export { RssService };
