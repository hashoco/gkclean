import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: "egov-postgre.c4pk4am2m8jx.us-east-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: process.env.DB_PASS,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

console.log("🔍 DB_PASS =", process.env.DB_PASS);
