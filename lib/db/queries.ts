// import { desc, and, eq, isNull } from 'drizzle-orm';
// import { db } from './drizzle';
// import { activityLogs, users, NewUser } from './schema';
// import { cookies } from 'next/headers';
// import { verifyToken } from '@/lib/auth/session';

// // --- User Queries ---

// export async function getAuthenticatedUser() {
//   const sessionCookie = (await cookies()).get('session');
//   if (!sessionCookie || !sessionCookie.value) {
//     return null;
//   }

//   const sessionData = await verifyToken(sessionCookie.value);
//   if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'number') {
//     return null;
//   }

//   if (new Date(sessionData.expires) < new Date()) {
//     return null;
//   }

//   const user = await db.query.users.findFirst({
//     where: and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)),
//     with: {
//         addresses: true,
//     }
//   });

//   return user || null;
// }

// export async function getUsers() {
//   const usersList = await db.query.users.findMany({
//     where: isNull(users.deletedAt),
//     with: {
//         addresses: true
//     }
//   });
//   return usersList;
// }

// export async function getUserById(id: number) {
//   const user = await db.query.users.findFirst({
//     where: and(eq(users.id, id), isNull(users.deletedAt)),
//     with: {
//         addresses: true
//     }
//   });
//   return user || null;
// }

// export async function createUser(userData: NewUser) {
//   const newUser = await db.insert(users).values(userData).returning();
//   return newUser[0];
// }

// export async function updateUser(id: number, userData: Partial<NewUser>) {
//   const updatedUser = await db
//     .update(users)
//     .set({ ...userData, updatedAt: new Date() })
//     .where(and(eq(users.id, id), isNull(users.deletedAt)))
//     .returning();
//   return updatedUser[0];
// }

// export async function deleteUser(id: number) {
//   // We perform a "soft delete" by setting the deletedAt timestamp
//   const deletedUser = await db
//     .update(users)
//     .set({ deletedAt: new Date() })
//     .where(and(eq(users.id, id), isNull(users.deletedAt)))
//     .returning();
//   return deletedUser[0];
// }

// // --- Payment/Subscription Queries (now on User) ---

// export async function getUserByMercadoPagoCustomerId(customerId: string) {
//   const user = await db.query.users.findFirst({
//     where: eq(users.mpCustomerId, customerId),
//   });
//   return user || null;
// }

// export async function updateUserSubscription(
//   userId: number,
//   subscriptionData: {
//     mpSubscriptionId: string | null;
//     mpCustomerId?: string | null;
//   }
// ) {
//   await db
//     .update(users)
//     .set({
//       ...subscriptionData,
//       updatedAt: new Date(),
//     })
//     .where(eq(users.id, userId));
// }

// // --- Activity Log Queries ---

// export async function getActivityLogsForUser(userId: number) {
//     const logs = await db.query.activityLogs.findMany({
//         where: eq(activityLogs.userId, userId),
//         with: {
//             user: {
//                 columns: { name: true, email: true }
//             }
//         },
//         orderBy: [desc(activityLogs.timestamp)],
//         limit: 20,
//     });
//     return logs;
// }

// export async function getAllActivityLogs() {
//     const logs = await db.query.activityLogs.findMany({
//         with: {
//             user: {
//                 columns: { name: true, email: true }
//             }
//         },
//         orderBy: [desc(activityLogs.timestamp)],
//         limit: 100, // limit for general admin view
//     });
//     return logs;
// }

// import { desc, and, eq, isNull } from 'drizzle-orm';
// import { db } from './drizzle';
// import { activityLogs, users, NewUser } from './schema';
// import { cookies } from 'next/headers';
// import { verifyToken } from '@/lib/auth/session';

// // --- User Queries ---

// export async function getAuthenticatedUser() {
//   const sessionCookie = (await cookies()).get('session');
//   if (!sessionCookie || !sessionCookie.value) {
//     return null;
//   }

//   const sessionData = await verifyToken(sessionCookie.value);
//   if (
//     !sessionData ||
//     !sessionData.user ||
//     typeof sessionData.user.id !== 'number'
//   ) {
//     return null;
//   }

//   if (new Date(sessionData.expires) < new Date()) {
//     return null;
//   }

//   const user = await db.query.users.findFirst({
//     where: and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)),
//     with: {
//       addresses: true,
//     },
//   });

//   return user || null;
// }

// export async function getUsers() {
//   const usersList = await db.query.users.findMany({
//     where: isNull(users.deletedAt),
//     with: {
//       addresses: true,
//     },
//   });
//   return usersList;
// }

// export async function getUserById(id: number) {
//   const user = await db.query.users.findFirst({
//     where: and(eq(users.id, id), isNull(users.deletedAt)),
//     with: {
//       addresses: true,
//     },
//   });
//   return user || null;
// }

// export async function createUser(userData: NewUser) {
//   const newUser = await db.insert(users).values(userData).returning();
//   return newUser[0];
// }

// export async function updateUser(id: number, userData: Partial<NewUser>) {
//   const updatedUser = await db
//     .update(users)
//     .set({ ...userData, updatedAt: new Date() })
//     .where(and(eq(users.id, id), isNull(users.deletedAt)))
//     .returning();
//   return updatedUser[0];
// }

// export async function deleteUser(id: number) {
//   // We perform a "soft delete" by setting the deletedAt timestamp
//   const deletedUser = await db
//     .update(users)
//     .set({ deletedAt: new Date() })
//     .where(and(eq(users.id, id), isNull(users.deletedAt)))
//     .returning();
//   return deletedUser[0];
// }

// // --- Payment/Subscription Queries (now on User) ---

// export async function getUserByMercadoPagoCustomerId(customerId: string) {
//   const user = await db.query.users.findFirst({
//     where: eq(users.mpCustomerId, customerId),
//   });
//   return user || null;
// }

// export async function updateUserSubscription(
//   userId: number,
//   subscriptionData: {
//     mpSubscriptionId: string | null;
//     mpCustomerId?: string | null;
//   }
// ) {
//   await db
//     .update(users)
//     .set({
//       ...subscriptionData,
//       updatedAt: new Date(),
//     })
//     .where(eq(users.id, userId));
// }

// // --- Activity Log Queries ---

// export async function getActivityLogsForUser(userId: number) {
//   const logs = await db.query.activityLogs.findMany({
//     where: eq(activityLogs.userId, userId),
//     with: {
//       user: {
//         columns: { name: true, email: true },
//       },
//     },
//     orderBy: [desc(activityLogs.timestamp)],
//     limit: 20,
//   });
//   return logs;
// }

// export async function getAllActivityLogs() {
//   const logs = await db.query.activityLogs.findMany({
//     with: {
//       user: {
//         columns: { name: true, email: true },
//       },
//     },
//     orderBy: [desc(activityLogs.timestamp)],
//     limit: 100, // limit for general admin view
//   });
//   return logs;
// }

// import { desc, and, eq, isNull } from 'drizzle-orm';
// import { db } from './drizzle';
// import { activityLogs, users, NewUser } from './schema';
// import { cookies } from 'next/headers';
// import { verifyToken } from '@/lib/auth/session';

// // --- User Queries ---

// export async function getAuthenticatedUser() {
//   const sessionCookie = (await cookies()).get('session');
//   if (!sessionCookie || !sessionCookie.value) {
//     return null;
//   }

//   const sessionData = await verifyToken(sessionCookie.value);
//   if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'number') {
//     return null;
//   }

//   if (new Date(sessionData.expires) < new Date()) {
//     return null;
//   }

//   const user = await db.query.users.findFirst({
//     where: and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)),
//     with: {
//         addresses: true,
//     }
//   });

//   return user || null;
// }

// export async function getUsers() {
//   const usersList = await db.query.users.findMany({
//     where: isNull(users.deletedAt),
//     with: {
//         addresses: true
//     }
//   });
//   return usersList;
// }

// export async function getUserById(id: number) {
//   const user = await db.query.users.findFirst({
//     where: and(eq(users.id, id), isNull(users.deletedAt)),
//     with: {
//         addresses: true
//     }
//   });
//   return user || null;
// }

// export async function createUser(userData: NewUser) {
//   const newUser = await db.insert(users).values(userData).returning();
//   return newUser[0];
// }

// export async function updateUser(id: number, userData: Partial<NewUser>) {
//   const updatedUser = await db
//     .update(users)
//     .set({ ...userData, updatedAt: new Date() })
//     .where(and(eq(users.id, id), isNull(users.deletedAt)))
//     .returning();
//   return updatedUser[0];
// }

// export async function deleteUser(id: number) {
//   // We perform a "soft delete" by setting the deletedAt timestamp
//   const deletedUser = await db
//     .update(users)
//     .set({ deletedAt: new Date() })
//     .where(and(eq(users.id, id), isNull(users.deletedAt)))
//     .returning();
//   return deletedUser[0];
// }

// // --- Payment/Subscription Queries (now on User) ---

// export async function getUserByMercadoPagoCustomerId(customerId: string) {
//   const user = await db.query.users.findFirst({
//     where: eq(users.mpCustomerId, customerId),
//   });
//   return user || null;
// }

// export async function updateUserSubscription(
//   userId: number,
//   subscriptionData: {
//     mpSubscriptionId: string | null;
//     mpCustomerId?: string | null;
//   }
// ) {
//   await db
//     .update(users)
//     .set({
//       ...subscriptionData,
//       updatedAt: new Date(),
//     })
//     .where(eq(users.id, userId));
// }

// // --- Activity Log Queries ---

// export async function getActivityLogsForUser(userId: number) {
//     const logs = await db.query.activityLogs.findMany({
//         where: eq(activityLogs.userId, userId),
//         with: {
//             user: {
//                 columns: { name: true, email: true }
//             }
//         },
//         orderBy: [desc(activityLogs.timestamp)],
//         limit: 20,
//     });
//     return logs;
// }

// export async function getAllActivityLogs() {
//     const logs = await db.query.activityLogs.findMany({
//         with: {
//             user: {
//                 columns: { name: true, email: true }
//             }
//         },
//         orderBy: [desc(activityLogs.timestamp)],
//         limit: 100, // limit for general admin view
//     });
//     return logs;
// }

import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, users, NewUser } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

// --- User Queries ---

export async function getAuthenticatedUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const sessionData = await verifyToken(sessionCookie.value);
    if (!sessionData || !sessionData.user) {
      return null;
    }

    if (new Date(sessionData.expires) < new Date()) {
      // Optional: Clear the expired cookie
      // cookies().delete('session');
      return null;
    }

    // Return user data directly from the session token
    // This is not a full `User` object, but contains what's needed for auth checks
    return sessionData.user;
  } catch (error) {
    // If token verification fails
    console.error('Failed to verify session token:', error);
    return null;
  }
}

export async function getUsers() {
  const usersList = await db.query.users.findMany({
    where: isNull(users.deletedAt),
    with: {
      addresses: true,
    },
  });
  return usersList;
}

export async function getUserById(id: number) {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, id), isNull(users.deletedAt)),
    with: {
      addresses: {
        with: {
          meters: true,
        },
      },
    },
  });
  return user || null;
}

export async function createUser(userData: NewUser) {
  const newUser = await db.insert(users).values(userData).returning();
  return newUser[0];
}

export async function updateUser(id: number, userData: Partial<NewUser>) {
  const updatedUser = await db
    .update(users)
    .set({ ...userData, updatedAt: new Date() })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning();
  return updatedUser[0];
}

export async function deleteUser(id: number) {
  // We perform a "soft delete" by setting the deletedAt timestamp
  const deletedUser = await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning();
  return deletedUser[0];
}

// --- Payment/Subscription Queries (now on User) ---

export async function getUserByMercadoPagoCustomerId(customerId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.mpCustomerId, customerId),
  });
  return user || null;
}

export async function updateUserSubscription(
  userId: number,
  subscriptionData: {
    mpSubscriptionId: string | null;
    mpCustomerId?: string | null;
  }
) {
  await db
    .update(users)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

// --- Activity Log Queries ---

export async function getActivityLogsForUser(userId: number) {
  const logs = await db.query.activityLogs.findMany({
    where: eq(activityLogs.userId, userId),
    with: {
      user: {
        columns: { name: true, email: true },
      },
    },
    orderBy: [desc(activityLogs.timestamp)],
    limit: 20,
  });
  return logs;
}

export async function getAllActivityLogs() {
  const logs = await db.query.activityLogs.findMany({
    with: {
      user: {
        columns: { name: true, email: true },
      },
    },
    orderBy: [desc(activityLogs.timestamp)],
    limit: 100, // limit for general admin view
  });
  return logs;
}
