
import { defineConfig } from 'drizzle-kit'

const dbURL = process.env.DB_FILE_NAME;
if (!dbURL) {
    throw new Error("Environment variable DB_FILE_NAME is not set");
}

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: dbURL
    },
});