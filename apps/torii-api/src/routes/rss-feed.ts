import { Router } from "express";
import Joi from "joi";
import Database from "../database";
import { validate } from "../tools/JoiTools";

const RssFeedRouter = Router();

const RssFeedInsertSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
});

const RssFeedPatchBodySchema = Joi.object({
  name: Joi.string().optional(),
  url: Joi.string().optional(),
});

const RssFeedPatchParamsSchema = Joi.object({
  id: Joi.number().required(),
});

RssFeedRouter.get("/", async (req, res) => {
  const rssFeeds = await Database.models.RssFeed.findAll();
  res.send({ rssFeeds });
});

RssFeedRouter.post("/", validate(RssFeedInsertSchema), async (req, res) => {
  const newOne = await Database.models.RssFeed.create({
    name: req.body.name,
    url: req.body.url,
  });

  res.send({ ok: newOne });
});

RssFeedRouter.patch(
  "/:id",
  validate(RssFeedPatchParamsSchema, "params"),
  validate(RssFeedPatchBodySchema),
  async (req, res) => {
    try {
      const updatedRss = await Database.models.RssFeed.updateRssFeed(
        parseInt(req.params.id),
        req.body
      );

      res.send({ entry: updatedRss });
    } catch (e: any) {
      res.status(500).send({ error: e.toString() });
    }
  }
);

RssFeedRouter.delete(
  "/:id",
  validate(RssFeedPatchParamsSchema, "params"),
  async (req, res) => {
    try {
      const deletedFeed = await Database.models.RssFeed.deleteRssFeed(
        parseInt(req.params.id)
      );

      res.send({ deleted: deletedFeed });
    } catch (e: any) {
      res.status(500).send({ error: e.toString() });
    }
  }
);

export default RssFeedRouter;
