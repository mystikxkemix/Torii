import WebTorrent from "webtorrent";
import { Model, Sequelize, DataTypes } from "sequelize";

export default class DownloadData extends Model {
  declare id: number;
  declare rssFeedId: number;
  declare name: string;
  declare startFetch: Date;
  declare endFetch?: Date;
  private _client: WebTorrent.Instance;

  constructor() {
    super();
    this._client = new WebTorrent();
  }

  public static new(rssFeedId: number, name: string) {
    const newData = new DownloadData();
    newData.rssFeedId = rssFeedId;
    newData.name = name;
    newData.startFetch = new Date();

    return newData;
  }

  public async startFetching() {
    const torrent = await this._client.add(this.name);
    torrent.on("download", (bytes: number) => {
      console.log("just downloaded: " + bytes);
      console.log("total downloaded: " + torrent.downloaded);
      console.log("download speed: " + torrent.downloadSpeed);
      console.log("progress: " + torrent.progress);
    });

    torrent.on("done", () => {
      console.log("torrent download finished");
    });
  }

  public async pauseFetching() {}

  public async resumeFetching() {}
}

export async function init(sequelize: Sequelize) {
  DownloadData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rssFeedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startFetch: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endFetch: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize, modelName: "DownloadData" }
  );
  console.log("init", DownloadData);
  await DownloadData.sync({ alter: true });
}
