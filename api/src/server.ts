import express from "express";
import cors from "cors";
import { db } from "@mack/shared/db/db";

import datasetsRouter from "./routes/dataset";
import projectsRouter from "./routes/project";
import visitsRouter from "./routes/visit";
import researchersRouter from "./routes/researcher";

const app = express();
const port = 3000;

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
  console.log("HELLOOOO", datasetsRouter, projectsRouter, visitsRouter, researchersRouter);
  return console.log(`Express is listening at http://localhost:${port}`);
});

export default app;
