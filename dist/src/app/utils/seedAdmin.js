"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
/* eslint-disable no-console */
// import { PrismaClient } from '@prisma/client';
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
// import { prisma } from "app/lib/prisma";
//
async function seedAdmin() {
    console.log('🌱 Seeding admin user...');
    const adminEmail = 'admin@tripSync.com';
    // Check if admin already exists
    const existingAdmin = await prisma_1.prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (existingAdmin) {
        console.log('❗ Admin user already exists. Skipping seed.');
        return;
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash('Admin123!', 10);
    // Create admin user
    const admin = await prisma_1.prisma.user.create({
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
