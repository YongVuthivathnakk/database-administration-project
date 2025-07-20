import { pool } from "../utils/database.js";

// Get all beekeepers
export async function getAllBeekeepers() {
  const [rows] = await pool.query("SELECT * FROM Beekeeper ORDER BY BeekeeperID DESC");
  return rows;
}

// Get beekeeper by ID
export async function getBeekeeperById(id) {
  const [rows] = await pool.query("SELECT * FROM Beekeeper WHERE BeekeeperID = ?", [id]);
  return rows[0];
}

// Create a new beekeeper
export async function createBeekeeper(data) {
  const { Name, Email, Phone } = data;
  const [result] = await pool.query(
    "INSERT INTO Beekeeper (Name, Email, Phone) VALUES (?, ?, ?)",
    [Name, Email, Phone]
  );
  return { BeekeeperID: result.insertId, Name, Email, Phone };
}

// Update beekeeper
export async function updateBeekeeper(id, data) {
  const { Name, Email, Phone } = data;
  await pool.query(
    "UPDATE Beekeeper SET Name = ?, Email = ?, Phone = ? WHERE BeekeeperID = ?",
    [Name, Email, Phone, id]
  );
  return getBeekeeperById(id);
}

// Delete beekeeper
export async function deleteBeekeeper(id) {
  await pool.query("DELETE FROM Beekeeper WHERE BeekeeperID = ?", [id]);
}