import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
dotenv.config();

export const db = drizzle(process.env.DATABASE_URL!);
