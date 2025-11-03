import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!_db) {
      if (!process.env.DATABASE_URL) {
        throw new Error("database url not found");
      }
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle(sql);
    }
    return Reflect.get(_db, prop);
  },
});
