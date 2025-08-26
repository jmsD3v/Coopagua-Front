import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMs for specific roles and statuses
export const connectionStatusEnum = pgEnum('connection_status', [
  'activa',
  'morosa',
  'suspendida',
]);

export const userRoleEnum = pgEnum('user_role', [
  'socio',
  'admin',
  'superadmin',
]);

// Main USERS table for "socios", "admins", etc.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('socio').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  // New fields for "abonado"
  phone: varchar('phone', { length: 50 }),
  membershipNumber: varchar('membership_number', { length: 100 }).unique(),
  tariffCategory: varchar('tariff_category', { length: 100 }),
  connectionStatus: connectionStatusEnum('connection_status').default('activa'),
  // Fields for payment integration (moved from teams)
  mpCustomerId: text('mp_customer_id').unique(),
  mpSubscriptionId: text('mp_subscription_id').unique(),
});

// ADDRESSES table, linked to users
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  street: varchar('street', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  zip: varchar('zip', { length: 20 }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

// ACTIVITY LOGS table, linked to the admin user performing the action
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id), // The admin/superadmin who performed the action
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  details: text('details'), // Optional field for more context
});

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  activityLogs: many(activityLogs),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));


// --- TYPES ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// Simplified ActivityType enum, can be expanded later
export enum ActivityType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  // etc.
}
