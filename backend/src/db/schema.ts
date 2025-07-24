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

const StatusEnum = pgEnum("status", [
    "Ongoing",
    "Completed",
    "Cancelled",
    "Hiatus",
]);

export const seriesTable = pgTable("series_table", {
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
    status: StatusEnum("status").default("Ongoing"),
    isVisible: boolean("isVisible").default(false),
    isFeatured: boolean("isFeatured").default(false),
    author: varchar("author", { length: 50 }),
    availableChapters: integer("availableChapters")
        .array()
        .default(sql`ARRAY[]::integer[]`),
    totalReaders: integer("totalReaders").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapterTable = pgTable("chapter_table", {
    id: uuid("id").primaryKey().defaultRandom(),
    chapterNumber: integer("chapterNumber").notNull(),
    chapterTitle: varchar("chapterTitle"),
    seriesId: uuid("seriesId")
        .notNull()
        .references(() => seriesTable.id, { onDelete: "cascade" }),
    isVisible: boolean("isVisible").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sideConfig = pgTable("site_config", {
    id: text("id")
        .primaryKey()
        .$default(() => "global"),
    totalVisitor: integer("totalVisitor").default(0),
    showComingSoon: boolean("showComingSoon").default(false),
    maintenanceMode: boolean("maintenanceMode").default(false),
    showFeaturedSeries: boolean("showFeaturedSeries").default(false),
});
