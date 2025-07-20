import express from "express";
import cors from "cors";
import router from "./routes/beekeeperRoutes.js";
import beeSpeciesRoutes from "./routes/beeSpeciesRoutes.js";
import hiveRoutes from "./routes/hiveRoutes.js";
import environmentRoutes from "./routes/environmentRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import honeyRoutes from "./routes/honeyRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Mount routes
app.use("/api/beekeepers", router);
app.use("/api/beespecies", beeSpeciesRoutes);
app.use("/api/hives", hiveRoutes);
app.use("/api/environment", environmentRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/honey", honeyRoutes);
app.use("/api", backupRoutes)
app.use("/api/users", userRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
