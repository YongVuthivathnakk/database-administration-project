import * as beekeeperRepository from "../repositories/beekeeperRepository.js";
import * as hiveRepository from "../repositories/hiveRepository.js";

// GET /api/beekeepers
export async function getAllBeekeepers(req, res) {
  try {
    const beekeepers = await beekeeperRepository.getAllBeekeepers();
    res.json(beekeepers);
  } catch (error) {
    console.error("Error fetching beekeepers:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/beekeepers/:id
export async function getBeekeeperById(req, res) {
  try {
    const beekeeper = await beekeeperRepository.getBeekeeperById(req.params.id);
    if (!beekeeper) {
      return res.status(404).json({ message: "Beekeeper not found" });
    }
    res.json(beekeeper);
  } catch (error) {
    console.error("Error in getBeekeeperById:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/beekeepers
export async function createBeekeeper(req, res) {
  try {
    const newBeekeeper = await beekeeperRepository.createBeekeeper(req.body);
    res.status(201).json(newBeekeeper);
  } catch (error) {
    console.error("Error creating beekeeper:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/beekeepers/:id
export async function updateBeekeeper(req, res) {
  try {
    const updatedBeekeeper = await beekeeperRepository.updateBeekeeper(
      req.params.id,
      req.body
    );
    if (!updatedBeekeeper) {
      return res.status(404).json({ message: "Beekeeper not found" });
    }
    res.json(updatedBeekeeper);
  } catch (error) {
    console.error("Error in updateBeekeeper:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/beekeepers/:id
export async function deleteBeekeeper(req, res) {
  try {
    await beekeeperRepository.deleteBeekeeper(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting beekeeper:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/beekeepers/:id/hives
export async function getHivesByBeekeeper(req, res) {
  try {
    const hives = await hiveRepository.getHivesByBeekeeper(req.params.id);
    res.json(hives);
  } catch (error) {
    console.error("Error fetching hives for beekeeper:", error);
    res.status(500).json({ message: "Server error" });
  }
}
