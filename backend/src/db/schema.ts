import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const StatusEnum = pgEnum("status", [
  "Ongoing",
  "Completed",
  "Cancelled",
  "Hiatus",
]);

export const manhwaTable = pgTable("manhwas_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 100 }).notNull().unique(),
  alternativeTitles: varchar("alternativeTitles", { length: 100 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  description: text("description"),
  coverImageUrl: text("coverImage").notNull(),
  deleteImageUrl: text("deleteImageUrl").notNull(),
  genres: varchar("genres", { length: 50 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  status: StatusEnum("status"),
  isVisible: boolean("isVisible"),
  author: varchar("author", { length: 50 }),
  totalReaders: integer("totalReaders").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapterTable = pgTable("chapter_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  chapterNumber: integer("chapterNumber").notNull(),
  chapterTitle: varchar("chapterTitle"),
  manhwaId: uuid("manhwaId")
    .notNull()
    .references(() => manhwaTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const slidesTable = pgTable("slides_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("imageUrl").notNull(),
  deleteImageUrl: text("deleteImageUrl").notNull(),
  chapterId: uuid("chapterId")
    .notNull()
    .references(() => chapterTable.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
