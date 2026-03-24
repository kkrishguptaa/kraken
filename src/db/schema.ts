import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const issueStatusEnum = pgEnum("issue_status", ["draft", "published"]);

// Tables
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Matches Clerk userId
  username: text("username").unique().notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const publications = pgTable("publications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").unique().notNull(), // Matches username usually
  customDomain: text("custom_domain").unique(),
  customDomainVerified: boolean("custom_domain_verified").default(false),
  vercelDomainId: text("vercel_domain_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const issues = pgTable("issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  publicationId: uuid("publication_id")
    .notNull()
    .references(() => publications.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  editionNumber: integer("edition_number").notNull(),
  content: text("content").notNull(), // Raw markdown
  status: issueStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  publicationId: uuid("publication_id")
    .notNull()
    .references(() => publications.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  publicationId: uuid("publication_id")
    .notNull()
    .references(() => publications.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  emailNotificationsEnabled: boolean("email_notifications_enabled").default(
    true,
  ),
  token: text("token").unique().notNull(), // For unsubscribe links
  loopsContactId: text("loops_contact_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    emailNotificationsEnabled: boolean("email_notifications_enabled").default(
      true,
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.followerId, t.publicationId] }),
  }),
);

export const likes = pgTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    issueId: uuid("issue_id")
      .notNull()
      .references(() => issues.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.issueId] }),
  }),
);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  issueId: uuid("issue_id")
    .notNull()
    .references(() => issues.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  publication: one(publications, {
    fields: [users.id],
    references: [publications.userId],
  }),
  follows: many(follows),
  likes: many(likes),
  comments: many(comments),
}));

export const publicationsRelations = relations(
  publications,
  ({ one, many }) => ({
    user: one(users, {
      fields: [publications.userId],
      references: [users.id],
    }),
    issues: many(issues),
    templates: many(templates),
    subscribers: many(subscribers),
    followers: many(follows),
  }),
);

export const issuesRelations = relations(issues, ({ one, many }) => ({
  publication: one(publications, {
    fields: [issues.publicationId],
    references: [publications.id],
  }),
  likes: many(likes),
  comments: many(comments),
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  publication: one(publications, {
    fields: [subscribers.publicationId],
    references: [publications.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  publication: one(publications, {
    fields: [follows.publicationId],
    references: [publications.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  issue: one(issues, {
    fields: [likes.issueId],
    references: [issues.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  issue: one(issues, {
    fields: [comments.issueId],
    references: [issues.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
