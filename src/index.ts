import { Hono } from "hono";

import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./db.ts";

migrate(db, { migrationsFolder: "./drizzle" });

await import("./mqtt-subscriber.ts");

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
