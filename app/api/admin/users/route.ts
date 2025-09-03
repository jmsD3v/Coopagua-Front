// import { NextResponse } from 'next/server';
// import { getAuthenticatedUser, getUsers, createUser } from '@/lib/db/queries';
// import { User, NewUser } from '@/lib/db/schema';
// import { hashPassword } from '@/lib/auth/session';

// export async function GET() {
//   try {
//     const currentUser: User | null = await getAuthenticatedUser();

//     // Protect the route: only admins and superadmins can access
//     if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const users = await getUsers();
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error('Failed to fetch users:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const currentUser: User | null = await getAuthenticatedUser();

//     // Protect the route: only admins and superadmins can access
//     if (!currentUser || !['admin', 'superadmin'].includes(currentUser.role)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const body = await request.json();
//     const { email, password, ...otherData } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     const passwordHash = await hashPassword(password);

//     const newUser: NewUser = {
//       email,
//       passwordHash,
//       ...otherData,
//     };

//     const createdUser = await createUser(newUser);

//     // Don't return the password hash
//     const { passwordHash: _, ...userToReturn } = createdUser;

//     return NextResponse.json(userToReturn, { status: 201 });
//   } catch (error: any) {
//     // Handle specific error for duplicate email
//     if (error.code === '23505') {
//       return NextResponse.json(
//         { error: 'A user with this email already exists' },
//         { status: 409 }
//       );
//     }
//     console.error('Failed to create user:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import { getUsers, createUser } from '@/lib/db/queries';
// import { NewUser, User } from '@/lib/db/schema';
// import { hashPassword } from '@/lib/auth/session';
// import { withRoleProtection } from '@/lib/auth/middleware';

// // The wrapper handles the auth check. The handler only contains the core logic.
// const getHandler = async (req: Request, context: {}, sessionUser: any) => {
//   try {
//     const users = await getUsers();
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error('Failed to fetch users:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// const postHandler = async (req: Request, context: {}, sessionUser: any) => {
//   try {
//     const body = await req.json();
//     const { email, password, ...otherData } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     const passwordHash = await hashPassword(password);

//     const newUser: NewUser = {
//       email,
//       passwordHash,
//       ...otherData,
//     };

//     const createdUser = await createUser(newUser);

//     // Don't return the password hash
//     const { passwordHash: _, ...userToReturn } = createdUser;

//     return NextResponse.json(userToReturn, { status: 201 });
//   } catch (error: any) {
//     // Handle specific error for duplicate email
//     if (error.code === '23505') {
//       return NextResponse.json(
//         { error: 'A user with this email already exists' },
//         { status: 409 }
//       );
//     }
//     console.error('Failed to create user:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // Define allowed roles with the correct type
// const allowedRoles: User['role'][] = ['admin', 'superadmin'];

// // Export the protected routes
// export const GET = withRoleProtection(getHandler, allowedRoles);
// export const POST = withRoleProtection(postHandler, allowedRoles);

// import { NextResponse } from 'next/server';
// import { getUsers, createUser } from '@/lib/db/queries';
// import { NewUser, User } from '@/lib/db/schema';
// import { hashPassword } from '@/lib/auth/session';
// import { withRoleProtection } from '@/lib/auth/middleware';

// // The wrapper handles the auth check. The handler only contains the core logic.
// const getHandler = async (req: Request, context: {}, sessionUser: any) => {
//   try {
//     const users = await getUsers();
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error('Failed to fetch users:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// import { db } from '@/lib/db/drizzle';
// import { users, addresses, meters } from '@/lib/db/schema';

// const postHandler = async (req: Request, context: {}, sessionUser: any) => {
//   try {
//     const body = await req.json();

//     // Separate data for each table
//     const {
//       // User fields
//       name,
//       email,
//       password,
//       businessName,
//       documentType,
//       documentNumber,
//       vatCondition,
//       phone,
//       membershipNumber,
//       tariffCategory,
//       coefficient,
//       isTaxExempt,
//       enablePdfPrinting,
//       // Address fields
//       addressStreet,
//       addressNumber,
//       addressNeighborhood,
//       addressCity,
//       addressRoute,
//       addressBlock,
//       addressPlot,
//       addressChNumber,
//       addressSection,
//       addressDistrict,
//       // Meter field
//       meterNumber,
//       // Role/Status fields
//       isMember,
//       status,
//     } = body;

//     // A user must have at least a name and document number
//     if (!name || !documentNumber) {
//       return NextResponse.json(
//         { error: 'Name and document number are required.' },
//         { status: 400 }
//       );
//     }

//     const fullUser = await db.transaction(async (tx) => {
//       let passwordHash = null;
//       if (email && password) {
//         passwordHash = await hashPassword(password);
//       }

//       const newUser: NewUser = {
//         name,
//         email: email || null,
//         passwordHash,
//         businessName,
//         documentType,
//         documentNumber,
//         vatCondition,
//         phone,
//         membershipNumber,
//         tariffCategory,
//         coefficient,
//         isTaxExempt,
//         enablePdfPrinting,
//         role: isMember === 'socio' ? 'socio' : 'superadmin', // Placeholder for 'no_socio'
//         status: status === 'baja' ? 'baja' : 'activo',
//       };

//       const createdUsers = await tx.insert(users).values(newUser).returning();
//       const createdUser = createdUsers[0];

//       if (!createdUser) {
//         tx.rollback();
//         return null;
//       }

//       const newAddress = {
//         userId: createdUser.id,
//         street: addressStreet,
//         number: addressNumber,
//         neighborhood: addressNeighborhood,
//         city: addressCity,
//         route: addressRoute,
//         block: addressBlock,
//         plot: addressPlot,
//         chNumber: addressChNumber,
//         section: addressSection,
//         district: addressDistrict,
//       };

//       const createdAddresses = await tx
//         .insert(addresses)
//         .values(newAddress)
//         .returning();
//       const createdAddress = createdAddresses[0];

//       if (meterNumber) {
//         await tx.insert(meters).values({
//           addressId: createdAddress.id,
//           serialNumber: meterNumber,
//         });
//       }

//       // We don't need to return address/meter, just the user
//       return createdUser;
//     });

//     if (!fullUser) {
//       throw new Error('Transaction failed: Could not create user.');
//     }

//     // Don't return the password hash
//     const { passwordHash: _, ...userToReturn } = fullUser;

//     return NextResponse.json(userToReturn, { status: 201 });
//   } catch (error: any) {
//     // Handle specific error for duplicate email/document
//     if (error.code === '23505') {
//       return NextResponse.json(
//         { error: 'A user with this email or document number already exists.' },
//         { status: 409 }
//       );
//     }
//     console.error('Failed to create user:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// };

// // Define allowed roles with the correct type
// const allowedRoles: User['role'][] = ['admin', 'superadmin'];

// // Export the protected routes
// export const GET = withRoleProtection(getHandler, allowedRoles);
// export const POST = withRoleProtection(postHandler, allowedRoles);

import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/db/queries';
import { NewUser, User } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';
import { withRoleProtection } from '@/lib/auth/middleware';

// The wrapper handles the auth check. The handler only contains the core logic.
const getHandler = async (req: Request, context: {}, sessionUser: any) => {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

import { db } from '@/lib/db/drizzle';
import { users, addresses, meters } from '@/lib/db/schema';

const postHandler = async (req: Request, context: {}, sessionUser: any) => {
  try {
    const body = await req.json();

    // Separate data for each table
    const {
      // User fields
      name,
      email,
      password,
      businessName,
      documentType,
      documentNumber,
      vatCondition,
      phone,
      membershipNumber,
      tariffCategory,
      coefficient,
      isTaxExempt,
      enablePdfPrinting,
      // Address fields
      addressStreet,
      addressNumber,
      addressNeighborhood,
      addressCity,
      addressRoute,
      addressBlock,
      addressPlot,
      addressChNumber,
      addressSection,
      addressDistrict,
      // Meter field
      meterNumber,
      // Role/Status fields
      role,
      status,
    } = body;

    // A user must have at least a name and document number
    if (!name || !documentNumber) {
      return NextResponse.json(
        { error: 'Name and document number are required.' },
        { status: 400 }
      );
    }

    const fullUser = await db.transaction(async (tx) => {
      let passwordHash = null;
      if (email && password) {
        passwordHash = await hashPassword(password);
      }

      const newUser: NewUser = {
        name,
        email: email || null,
        passwordHash,
        businessName,
        documentType,
        documentNumber,
        vatCondition,
        phone,
        membershipNumber,
        tariffCategory,
        coefficient,
        isTaxExempt,
        enablePdfPrinting,
        role: role || 'socio', // Default to 'socio' if not provided
        status: status === 'baja' ? 'baja' : 'activo',
      };

      const createdUsers = await tx.insert(users).values(newUser).returning();
      const createdUser = createdUsers[0];

      if (!createdUser) {
        tx.rollback();
        return null;
      }

      const newAddress = {
        userId: createdUser.id,
        street: addressStreet,
        number: addressNumber,
        neighborhood: addressNeighborhood,
        city: addressCity,
        route: addressRoute,
        block: addressBlock,
        plot: addressPlot,
        chNumber: addressChNumber,
        section: addressSection,
        district: addressDistrict,
      };

      const createdAddresses = await tx
        .insert(addresses)
        .values(newAddress)
        .returning();
      const createdAddress = createdAddresses[0];

      if (meterNumber) {
        await tx.insert(meters).values({
          addressId: createdAddress.id,
          serialNumber: meterNumber,
        });
      }

      // We don't need to return address/meter, just the user
      return createdUser;
    });

    if (!fullUser) {
      throw new Error('Transaction failed: Could not create user.');
    }

    // Don't return the password hash
    const { passwordHash: _, ...userToReturn } = fullUser;

    return NextResponse.json(userToReturn, { status: 201 });
  } catch (error: any) {
    // Handle specific error for duplicate email/document
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A user with this email or document number already exists.' },
        { status: 409 }
      );
    }
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// Define allowed roles with the correct type
const allowedRoles: User['role'][] = ['admin', 'superadmin'];

// Export the protected routes
export const GET = withRoleProtection(getHandler, allowedRoles);
export const POST = withRoleProtection(postHandler, allowedRoles);
