import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "../db/schema.ts";
import { config } from "./config.ts";

export const connection = new Database(config.DB_PATH);
export const db = drizzle(connection, { schema });

