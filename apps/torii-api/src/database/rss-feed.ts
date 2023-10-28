import { DataTypes, Model, Sequelize } from "sequelize";

class RssFeed extends Model {
  declare id: number;
  declare name: string;
  declare url: string;
  declare lastFetch?: Date;

  static async updateRssFeed(
    id: number,
    rssFeedData: Partial<Omit<RssFeed, "id">>
  ) {
    try {
      const user = await this.findByPk(id);
      if (user) {
        await user.update(rssFeedData);
        return user;
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
}

export async function init(sequelize: Sequelize) {
  RssFeed.init(
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
      lastFetch: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize }
  );
  console.log("init", RssFeed);
  await RssFeed.sync({ alter: true });
}

export default RssFeed;
