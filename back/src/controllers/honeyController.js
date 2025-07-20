import { pool } from "../utils/database.js";

export async function getAllHoneyProduction(req, res) {
  const [rows] = await pool.query(
    `SELECT hp.*, h.Location
     FROM HoneyProduction hp
     LEFT JOIN Hive h ON hp.HiveID = h.HiveID`
  );
  res.json(rows);
}