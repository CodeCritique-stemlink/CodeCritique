import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import Pg from "pg";

const connectionString =process.env.DATABASE_URL as string;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

const pool = new Pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});
const adapter =new PrismaPg(pool); 

export const prisma =new PrismaClient({adapter})