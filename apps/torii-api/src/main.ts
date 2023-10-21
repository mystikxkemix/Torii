import express from "express";
import Database from "./database";
import setupRouters from "./routes";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

Database.connect()
  .then(() => {
    app.use(express.json());
    app.get("/", (req, res) => {
      res.send({ message: "Hello API" });
    });

    app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
    });
  })
  .then(() => {
    setupRouters(app);
  });
