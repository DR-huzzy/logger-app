import bcrypt from "bcrypt"
import * as path from "path";
import * as dotenv from "dotenv";
import { prisma } from "./lib/prisma";


dotenv.config({ path: path.resolve(process.cwd(), ".env") });





async function main() {

    const adminEmail = "admin@logger.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not defined in .env");
    }

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail,
        },
    });

    if (existingAdmin) {
        console.log("Admin user already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
        data: {
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
        }
    });

    console.log("Admin user created successfully.");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
