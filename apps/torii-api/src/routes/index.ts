import { Express } from "express";
import RssFeedRouter from "./rss-feed";

export default function setupRouters(app: Express) {
  app.use("/rss-feed", RssFeedRouter);

  app.use((err, req, res, next) => {
    console.error("THEEERREEE", err.stack);
    res.status(500).send("Something broke!");
  });
}
