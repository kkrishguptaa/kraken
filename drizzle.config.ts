import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import { getEnv } from "./src/lib/env";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getEnv("DATABASE_URL"),
  },
});
