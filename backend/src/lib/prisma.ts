import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import config from "../config";

const adapter = new PrismaMariaDb({
  host: config.database_host!,
  user: config.database_user!,
  password: config.database_password!,
  database: config.database_name!,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
