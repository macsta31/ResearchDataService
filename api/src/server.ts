import express from "express";
import cors from "cors";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from "@bull-board/express";
import { db } from "@mack/shared/db/db";

import datasetsRouter from "./routes/dataset";
import projectsRouter from "./routes/project";
import visitsRouter from "./routes/visit";
import researchersRouter from "./routes/researcher";
import { cleaningQueue } from "@mack/shared/queues/cleaningQueue";

const app = express();
const port = 3000;

// BullBoard setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new (BullMQAdapter)(cleaningQueue),
    // add more queues here
  ],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", async (req, res) => {
  const out = await db.query("SELECT NOW()");
  console.log(out.rows);
  res.send(`${out.rows[0].now}`);
});

app.use("/datasets", datasetsRouter);
app.use("/projects", projectsRouter);
app.use("/visits", visitsRouter);
app.use("/researchers", researchersRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

export default app;
