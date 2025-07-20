import { useState, useEffect } from "react";
import { getALLBackup } from "../services/api";

function BackupDashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [backup, setBackup] = useState([]);
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        getALLBackup()
            .then((data) => {
                setBackup(data.backups || []); // your backend returns { backups: [...] }
            })
            .catch((err) => {
                setMessage({ type: "error", text: "Failed to load backups" });
            });
    }, []);

    const filtered = backup.filter((bk) => {
        if (!search.trim()) return true;
        return bk.file_name.toLowerCase().includes(search.toLowerCase());
    });

    const visible = filtered.slice(0, visibleCount);

    const handleBackup = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await fetch("http://localhost:4000/api/backup", {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Backup failed");

            setMessage({ type: "success", text: data.message || "Backup successful" });

            // Refresh backups list after backup
            const updated = await getALLBackup();
            setBackup(updated.backups || []);
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await fetch("http://localhost:4000/api/delete-all", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete data");
            setMessage({ type: "success", text: data.message || "Data deleted." });

            // You might want to refresh backup list or other data here
        } catch (err) {
            setMessage({ type: "error", text: err.message || "❌ Failed to delete data" });
        }
        setIsLoading(false);
    };

    const handleRestore = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await fetch("http://localhost:4000/api/restore", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to restore data");
            setMessage({ type: "success", text: data.message || "All data have been restored." });
        } catch (err) {
            setMessage({ type: "error", text: err.message || "❌ Failed to restore data" });
        }
        setIsLoading(false);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Backup Dashboard</h2>

            <input
                type="text"
                placeholder="Search backup files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 border rounded"
            />

            <div className="flex justify-between mb-4">
                <button
                    onClick={handleBackup}
                    disabled={isLoading}
                    className={`text-white font-medium px-4 py-2 rounded cursor-pointer ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-200"
                        }`}
                >
                    Backup Now
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleRestore}
                        disabled={isLoading}
                        className={`text-white font-medium px-4 py-2 rounded ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                    >
                        Restore All Data
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className={`text-white font-medium px-4 py-2 rounded ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-amber-700"
                            }`}
                    >
                        Delete All Data
                    </button>
                </div>
            </div>

            {message && (
                <div
                    className={`my-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div>
                {visible.map((bk) => (
                    <div key={bk.id} className="beekeeper-item backup-item p-2 border rounded mb-2">
                        📁 {bk.file_name} 
                        <div className="beekeeper-info">
                            <div>💾 {bk.size_mb} MB</div>
                            <div>📅 {new Date(bk.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                ))}

                {visible.length < filtered.length && (
                    <button
                        onClick={() => setVisibleCount((c) => c + 10)}
                        className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Load More
                    </button>
                )}

                {filtered.length === 0 && <div>No backup files found.</div>}
            </div>
        </div>
    );
}

export default BackupDashboard;
