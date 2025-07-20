import { pool } from "../utils/database.js";

// Get all hives for a specific beekeeper, including species and queen info
export async function getHivesByBeekeeper(beekeeperId) {
  const [rows] = await pool.query(
    `SELECT 
        h.HiveID, h.Location, h.InstallDate, h.Status,
        bs.CommonName AS BeeSpeciesName, bs.ScientificName,
        q.QueenID, q.BirthDate AS QueenBirthDate
     FROM Hive h
     LEFT JOIN BeeSpecies bs ON h.SpeciesID = bs.SpeciesID
     LEFT JOIN QueenBee q ON h.HiveID = q.HiveID
     WHERE h.BeekeeperID = ?`,
    [beekeeperId]
  );
  return rows;
}