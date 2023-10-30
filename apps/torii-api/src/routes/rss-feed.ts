import { Router } from "express";
import Joi from "joi";
import Database from "../database";
import { validate } from "../tools/JoiTools";
import { RssService } from "../services/rss-feed";

const RssFeedRouter = Router();

const RssFeedInsertSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  delayNumber: Joi.number().required(),
  delayUnit: Joi.string().required(),
  noDownload: Joi.boolean().required(),
});

const RssFeedPatchBodySchema = Joi.object({
  name: Joi.string().optional(),
  url: Joi.string().optional(),
});

const RssFeedPatchParamsSchema = Joi.object({
  id: Joi.number().required(),
});

RssFeedRouter.get("/", async (req, res) => {
  const rssFeeds = await Database.models.RssFeedData.findAll();
  res.send({ rssFeeds });
});

RssFeedRouter.post("/", validate(RssFeedInsertSchema), async (req, res) => {
  const newInsert = await RssService.createNewOne({
    name: req.body.name,
    url: req.body.url,
    delayNumber: req.body.delayNumber,
    delayUnit: req.body.delayUnit,
    noDownload: req.body.noDownload,
  });

  res.send({ rss: newInsert });
});

RssFeedRouter.patch(
  "/:id",
  validate(RssFeedPatchParamsSchema, "params"),
  validate(RssFeedPatchBodySchema),
  async (req, res) => {
    try {
      const updatedRss = await Database.models.RssFeedData.updateRssFeed(
        parseInt(req.params.id),
        req.body
      );

      res.send({ entry: updatedRss });
    } catch (e) {
      res.status(500).send({ error: e.toString() });
    }
  }
);

RssFeedRouter.delete(
  "/:id",
  validate(RssFeedPatchParamsSchema, "params"),
  async (req, res) => {
    try {
      const deletedFeed = await Database.models.RssFeedData.deleteRssFeed(
        parseInt(req.params.id)
      );

      res.send({ deleted: deletedFeed });
    } catch (e) {
      res.status(500).send({ error: e.toString() });
    }
  }
);

export default RssFeedRouter;
