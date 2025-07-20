import { pool } from "../utils/database.js";

export async function getAllEnvironmentData(req, res) {
  const [rows] = await pool.query(
    `SELECT e.*, h.Location, h.BeekeeperID
     FROM EnvironmentData e
     LEFT JOIN Hive h ON e.HiveID = h.HiveID`
  );
  res.json(rows);
}