/* import * as dotenv from 'dotenv';
dotenv.config({path: '../.env'}); */

import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });


import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env["DATABASE_URL"]}`;


const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })





export { prisma }

