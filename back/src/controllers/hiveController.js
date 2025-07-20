import { pool } from "../utils/database.js";

// Get all hives (for locations/buildings)
export async function getAllHives(req, res) {
  const [rows] = await pool.query(
    `SELECT h.*, b.Name AS BeekeeperName, bs.CommonName AS BeeSpeciesName, bs.ScientificName
     FROM Hive h
     LEFT JOIN Beekeeper b ON h.BeekeeperID = b.BeekeeperID
     LEFT JOIN BeeSpecies bs ON h.SpeciesID = bs.SpeciesID`
  );
  res.json(rows);
}

// Get hives by bee species
export async function getHivesBySpecies(req, res) {
  const { speciesId } = req.params;
  const [rows] = await pool.query(
    `SELECT h.*, b.Name AS BeekeeperName, bs.CommonName AS BeeSpeciesName, bs.ScientificName
     FROM Hive h
     LEFT JOIN Beekeeper b ON h.BeekeeperID = b.BeekeeperID
     LEFT JOIN BeeSpecies bs ON h.SpeciesID = bs.SpeciesID
     WHERE h.SpeciesID = ?`,
    [speciesId]
  );
  res.json(rows);
}