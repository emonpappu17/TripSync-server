/* eslint-disable no-console */
// import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from "app/lib/prisma";

export async function seedAdmin() {
    console.log('🌱 Seeding admin user...');

    const adminEmail = 'admin@tripSync.com';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('❗ Admin user already exists. Skipping seed.');
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            fullName: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            bio: 'Platform Administrator',
            isVerified: true,
        },
    });

    console.log('✅ Admin created successfully:');
    console.log(admin);
}


