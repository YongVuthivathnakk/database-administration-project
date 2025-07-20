
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { readdirSync } from "fs";
import dotenv from "dotenv";
import { pool } from "../utils/database.js"
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export class BackupController {

    static async getBackup(req, res) {
        try {
            const [rows] = await pool.query("SELECT * FROM backup_logs ORDER BY created_at DESC");
            return res.status(200).json({ backups: rows });
        } catch (err) {
            console.error("❌ Get backups error:", err.message);
            return res.status(500).json({ error: "Failed to retrieve backups" });
        }
    }

    static async backupDatabase(req, res) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `backup-${timestamp}.sql`;
        const backupDir = join(process.cwd(), "backups");
        const backupPath = join(backupDir, fileName);
        const command = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} --ignore-table=${process.env.DB_NAME}.backup_logs > "${backupPath}"`;


        exec(command, async (error) => {
            if (error) {
                console.error("❌ Backup error:", error.message);
                return res.status(500).json({ error: "Backup process failed" });
            }

            try {
                const stats = fs.statSync(backupPath);
                const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
                const createdAt = new Date();

                // ✅ Use pool instead of getConnection()
                const query = `INSERT INTO backup_logs (file_name, size_mb, created_at) VALUES (?, ?, ?)`;
                const values = [fileName, fileSizeMB, createdAt];
                const [results] = await pool.execute(query, values);

                return res.status(200).json({
                    message: "✅ Backup completed and logged successfully",
                    file: fileName,
                    size: `${fileSizeMB} MB`,
                    createdAt,
                    backupId: results.insertId,
                });
            } catch (fsErr) {
                console.error("❌ File stat or DB error:", fsErr.message);
                return res.status(500).json({ error: "Backup completed but metadata logging failed" });
            }
        });
    }

    static deleteAllData(req, res) {
        const tables = [
            "maintenancelog",
            "honeyproduction",
            "plantnearby",
            "environmentdata",
            "queenbee",
            "hive",
            "beespecies",
            "beekeeper"
        ];
        const command = tables.map((table) => `DELETE FROM ${table};`).join(" ");

        const fullCommand = `mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} -e \"USE ${process.env.DB_NAME}; ${command}\"`;

        exec(fullCommand, (err, stdout, stderr) => {
            if (err) {
                console.error("❌ Delete error:", err);
                return res.status(500).json({ error: "Failed to delete data" });
            }
            return res.status(200).json({ message: "✅ All data deleted successfully" });
        });
    };

    static restoreBackup = async (req, res) => {
        try {
            const backupDir = join(process.cwd(), "backups");
            const files = readdirSync(backupDir).filter(f => f.endsWith(".sql"));
            if (!files.length) return res.status(404).json({ error: "No backup file found" });

            const latestBackup = files.sort().reverse()[0];
            const filePath = join(backupDir, latestBackup);

            const command = `mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < "${filePath}"`;

            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error("❌ Restore error:", err);
                    return res.status(500).json({ error: "Failed to restore backup" });
                }
                return res.status(200).json({ message: `✅ Database restored from ${latestBackup}` });
            });
        } catch (err) {
            console.error("❌ File read error:", err);
            return res.status(500).json({ error: "Failed to read backup files" });
        }
    };


}