import { pgTable, uuid, text, jsonb, timestamp, serial, boolean } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// --- Better Auth Tables ---
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('emailVerified').notNull(),
	image: text('image'),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull()
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expiresAt').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	userId: text('userId').notNull().references(() => user.id, { onDelete: "cascade" })
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	userId: text('userId').notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	idToken: text('idToken'),
	accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
	refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull()
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expiresAt').notNull(),
	createdAt: timestamp('createdAt'),
	updatedAt: timestamp('updatedAt')
});


// --- Core Feature Tables ---
export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  passwordHash: text('password_hash'),
  qrConfig: jsonb('qr_config'),
  adContent: text('ad_content'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  linkId: uuid('link_id').references(() => links.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at', { withTimezone: true }).defaultNow(),
  ipAddress: text('ip_address'),
  country: text('country'),
  region: text('region'),
  city: text('city'),
  deviceType: text('device_type'),
  browser: text('browser'),
  referrer: text('referrer'),
});

// --- Relations ---
export const linksRelations = relations(links, ({ many, one }) => ({
  analytics: many(analytics),
  user: one(user, {
    fields: [links.userId],
    references: [user.id]
  })
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  link: one(links, {
    fields: [analytics.linkId],
    references: [links.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  links: many(links)
}));
