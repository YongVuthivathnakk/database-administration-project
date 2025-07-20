import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllBeekeepers, deleteBeekeeper } from "../services/api";

export default function BeekeeperList() {
  const [beekeepers, setBeekeepers] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [refreshPressed, setRefreshPressed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBeekeepers().then(setBeekeepers);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this beekeeper?")) {
      await deleteBeekeeper(id);
      setBeekeepers(beekeepers.filter(bk => bk.BeekeeperID !== id));
    }
  };

  const handleRefresh = async () => {
    setRefreshPressed(true);
    await getAllBeekeepers().then(setBeekeepers);
    setTimeout(() => setRefreshPressed(false), 300); // Reset after 300ms
  };

  // Filter and paginate
  const filtered = beekeepers.filter(bk => {
    if (!search.trim()) return true; // Show all if search is empty
    if (!bk.Name) return false; // Hide only if searching and no name
    return bk.Name.toLowerCase().includes(search.toLowerCase());
  });
  const visible = filtered.slice(0, visibleCount);

  // Debug log
  console.log('Loaded beekeepers:', beekeepers);

  return (
    <div className="beekeeper-list">
      <h2>Beekeepers</h2>
      <button
        onClick={() => navigate("/beekeepers/create")}
        className="button primary"
        style={{marginBottom: "1em"}}
      >
        + Add Beekeeper
      </button>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom: "1em", padding: "0.5em", width: "100%"}}
      />
      {visible.map(bk => (
        <div key={bk.BeekeeperID} className="beekeeper-item">
          <NavLink to={`/beekeepers/${bk.BeekeeperID}/hives`} className="beekeeper-name">
            🧑‍🌾 {bk.Name}
          </NavLink>
          <div className="beekeeper-info">
            <div>📧 {bk.Email}</div>
            <div>📞 {bk.Phone}</div>
            <div>{bk.Location}</div>
          </div>
          <div className="beekeeper-actions">
            <button onClick={() => navigate(`/beekeepers/edit/${bk.BeekeeperID}`)}>
              ✏️ Edit
            </button>
            <button onClick={() => handleDelete(bk.BeekeeperID)} style={{marginLeft: "8px"}}>🗑️ Delete</button>
          </div>
        </div>
      ))}
      {visible.length < filtered.length && (
        <button onClick={() => setVisibleCount(c => c + 10)} style={{margin: "2em auto", display: "block"}}>
          Load More
        </button>
      )}
      {filtered.length === 0 && <div>No beekeepers found for this location.</div>}
    </div>
  );
}