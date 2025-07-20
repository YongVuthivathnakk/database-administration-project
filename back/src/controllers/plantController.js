import { pool } from "../utils/database.js";

export async function getAllPlants(req, res) {
  const [rows] = await pool.query(
    `SELECT p.*, h.Location, h.BeekeeperID
     FROM PlantNearby p
     LEFT JOIN Hive h ON p.HiveID = h.HiveID`
  );
  res.json(rows);
}