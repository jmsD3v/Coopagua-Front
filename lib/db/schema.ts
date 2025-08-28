// import {
//   pgTable,
//   serial,
//   varchar,
//   text,
//   timestamp,
//   integer,
//   pgEnum,
// } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';

// // ENUMs for specific roles and statuses
// export const connectionStatusEnum = pgEnum('connection_status', [
//   'activa',
//   'morosa',
//   'suspendida',
// ]);

// export const userRoleEnum = pgEnum('user_role', [
//   'socio',
//   'admin',
//   'superadmin',
// ]);

// // Main USERS table for "socios", "admins", etc.
// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 100 }),
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   passwordHash: text('password_hash').notNull(),
//   role: userRoleEnum('role').default('socio').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   deletedAt: timestamp('deleted_at'),
//   // New fields for "abonado"
//   phone: varchar('phone', { length: 50 }),
//   membershipNumber: varchar('membership_number', { length: 100 }).unique(),
//   tariffCategory: varchar('tariff_category', { length: 100 }),
//   connectionStatus: connectionStatusEnum('connection_status').default('activa'),
//   // Fields for payment integration (moved from teams)
//   mpCustomerId: text('mp_customer_id').unique(),
//   mpSubscriptionId: text('mp_subscription_id').unique(),
// });

// // ADDRESSES table, linked to users
// export const addresses = pgTable('addresses', {
//   id: serial('id').primaryKey(),
//   street: varchar('street', { length: 255 }),
//   city: varchar('city', { length: 100 }),
//   state: varchar('state', { length: 100 }),
//   zip: varchar('zip', { length: 20 }),
//   userId: integer('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
// });

// // ACTIVITY LOGS table, linked to the admin user performing the action
// export const activityLogs = pgTable('activity_logs', {
//   id: serial('id').primaryKey(),
//   userId: integer('user_id')
//     .notNull()
//     .references(() => users.id), // The admin/superadmin who performed the action
//   action: text('action').notNull(),
//   timestamp: timestamp('timestamp').notNull().defaultNow(),
//   ipAddress: varchar('ip_address', { length: 45 }),
//   details: text('details'), // Optional field for more context
// });

// // --- RELATIONS ---

// export const usersRelations = relations(users, ({ many }) => ({
//   addresses: many(addresses),
//   activityLogs: many(activityLogs),
// }));

// export const addressesRelations = relations(addresses, ({ one }) => ({
//   user: one(users, {
//     fields: [addresses.userId],
//     references: [users.id],
//   }),
// }));

// export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
//   user: one(users, {
//     fields: [activityLogs.userId],
//     references: [users.id],
//   }),
// }));

// // --- TYPES ---

// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
// export type Address = typeof addresses.$inferSelect;
// export type NewAddress = typeof addresses.$inferInsert;
// export type ActivityLog = typeof activityLogs.$inferSelect;
// export type NewActivityLog = typeof activityLogs.$inferInsert;

// // Simplified ActivityType enum, can be expanded later
// export enum ActivityType {
//   USER_LOGIN = 'USER_LOGIN',
//   USER_LOGOUT = 'USER_LOGOUT',
//   USER_CREATE = 'USER_CREATE',
//   USER_UPDATE = 'USER_UPDATE',
//   USER_DELETE = 'USER_DELETE',
//   // etc.
// }

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  numeric,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMs ---

export const userRoleEnum = pgEnum('user_role', [
  'socio',
  'admin',
  'tecnico',
  'superadmin',
]);

export const userStatusEnum = pgEnum('user_status', [
  'activo',
  'moroso',
  'suspendido',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'pendiente',
  'pagada',
  'vencida',
]);

export const claimStatusEnum = pgEnum('claim_status', [
  'abierto',
  'en proceso',
  'resuelto',
]);

// --- TABLES (All in English) ---

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  dni: varchar('dni', { length: 50 }).unique(),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').default('socio').notNull(),
  status: userStatusEnum('status').default('activo').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
  phone: varchar('phone', { length: 50 }),
  membershipNumber: varchar('membership_number', { length: 100 }).unique(),
  tariffCategory: varchar('tariff_category', { length: 100 }),
  mpCustomerId: text('mp_customer_id').unique(),
  mpSubscriptionId: text('mp_subscription_id').unique(),
});

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  street: varchar('street', { length: 255 }).notNull(),
  number: varchar('number', { length: 50 }),
  neighborhood: varchar('neighborhood', { length: 100 }),
  city: varchar('city', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('activo').notNull(),
});

export const meters = pgTable('meters', {
  id: serial('id').primaryKey(),
  addressId: integer('address_id')
    .notNull()
    .references(() => addresses.id),
  serialNumber: varchar('serial_number', { length: 255 }).unique().notNull(),
  type: varchar('type', { length: 100 }),
  installationDate: date('installation_date'),
});

export const readings = pgTable('readings', {
  id: serial('id').primaryKey(),
  meterId: integer('meter_id')
    .notNull()
    .references(() => meters.id),
  date: date('date').notNull(),
  readingM3: numeric('reading_m3', { precision: 10, scale: 2 }).notNull(),
  observations: text('observations'),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  readingId: integer('reading_id').references(() => readings.id),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  issueDate: date('issue_date').notNull(),
  dueDate: date('due_date').notNull(),
  status: invoiceStatusEnum('status').default('pendiente').notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id')
    .notNull()
    .references(() => invoices.id),
  paymentDate: date('payment_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
});

export const claims = pgTable('claims', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  addressId: integer('address_id')
    .notNull()
    .references(() => addresses.id),
  type: varchar('type', { length: 255 }).notNull(),
  description: text('description'),
  status: claimStatusEnum('status').default('abierto').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  assignedTechnicianId: integer('assigned_technician_id').references(
    () => users.id
  ),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  invoices: many(invoices),
  claims: many(claims),
  assignedClaims: many(claims, { relationName: 'assigned_claims' }),
  activityLogs: many(activityLogs),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
  meters: many(meters),
  claims: many(claims),
}));

export const metersRelations = relations(meters, ({ one, many }) => ({
  address: one(addresses, {
    fields: [meters.addressId],
    references: [addresses.id],
  }),
  readings: many(readings),
}));

export const readingsRelations = relations(readings, ({ one, many }) => ({
  meter: one(meters, { fields: [readings.meterId], references: [meters.id] }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  reading: one(readings, {
    fields: [invoices.readingId],
    references: [readings.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  user: one(users, { fields: [claims.userId], references: [users.id] }),
  address: one(addresses, {
    fields: [claims.addressId],
    references: [addresses.id],
  }),
  assignedTechnician: one(users, {
    fields: [claims.assignedTechnicianId],
    references: [users.id],
    relationName: 'assigned_claims',
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

// --- TYPES ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type Meter = typeof meters.$inferSelect;
export type NewMeter = typeof meters.$inferInsert;
export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// Re-adding the ActivityType enum
export enum ActivityType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
}
