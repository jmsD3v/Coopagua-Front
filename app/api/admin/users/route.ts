import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/db/queries';
import { NewUser, User } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/session';
import { withRoleProtection } from '@/lib/auth/middleware';
import { db } from '@/lib/db/drizzle';
import { users, addresses, meters } from '@/lib/db/schema';

// --- GET Handler ---
const getHandler = async (
  req: Request,
  context: { params: {} },
  sessionUser: any
): Promise<Response> => {
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

// --- POST Handler ---
const postHandler = async (
  req: Request,
  context: { params: {} },
  sessionUser: any
): Promise<Response> => {
  try {
    const body = await req.json();

    const {
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
      meterNumber,
      role,
      status,
    } = body;

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
        role: role || 'socio',
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

      return createdUser;
    });

    if (!fullUser) {
      throw new Error('Transaction failed: Could not create user.');
    }

    const { passwordHash: _, ...userToReturn } = fullUser;
    return NextResponse.json(userToReturn, { status: 201 });
  } catch (error: any) {
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

// --- Allowed Roles ---
const allowedRoles: User['role'][] = ['admin', 'superadmin'];

// --- Exported Handlers with Middleware ---
export async function GET(
  req: Request,
  context: { params: {} }
): Promise<Response> {
  return withRoleProtection(getHandler, allowedRoles)(req, context);
}

export async function POST(
  req: Request,
  context: { params: {} }
): Promise<Response> {
  return withRoleProtection(postHandler, allowedRoles)(req, context);
}
