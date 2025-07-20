import { pool } from "../utils/database.js";

export async function getAllBeeSpecies(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM BeeSpecies ORDER BY CommonName");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}