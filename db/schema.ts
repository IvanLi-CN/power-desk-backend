import {
  blob,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const devices = sqliteTable(
  "devices",
  {
    id: text("id").primaryKey(),
    name: text("name").unique(),
  },
  (countries) => ({
    nameIdx: uniqueIndex("nameIdx").on(countries.name),
  }),
);

export const charge_channel_series_items = sqliteTable(
  "charge_channel_series_items",
  {
    id: integer("id").primaryKey(),
    deviceId: text("device_id")
      .notNull()
      .references(() => devices.id),
    channel: integer("channel").notNull(),
    timestamp: integer("timestamp").notNull(),
    values: blob("values").notNull(),
  },
);

export type ChargeChannelSeriesItem = typeof charge_channel_series_items.$inferSelect;