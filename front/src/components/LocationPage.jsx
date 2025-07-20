import { useEffect, useState } from "react";
import { getAllHives } from "../services/api";

function extractBuilding(location) {
  // Extracts "Building X" from "Rooftop Y, Building X"
  const match = location.match(/Building\s+\w+/i);
  return match ? match[0] : "Other";
}

export default function LocationPage() {
  const [hives, setHives] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => { getAllHives().then(setHives); }, []);

  // Filter hives by location search
  const filteredHives = search.trim()
    ? hives.filter(hive => hive.Location && hive.Location.toLowerCase().includes(search.toLowerCase()))
    : hives;

  // Group by building
  const grouped = filteredHives.reduce((acc, hive) => {
    const building = extractBuilding(hive.Location);
    acc[building] = acc[building] || [];
    acc[building].push(hive);
    return acc;
  }, {});

  return (
    <div>
      <h2>Locations & Buildings</h2>
      <input
        type="text"
        placeholder="Search by location..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom: "1em", padding: "0.5em", width: "100%"}}
      />
      {Object.entries(grouped).length === 0 && <div>No locations found.</div>}
      {Object.entries(grouped).map(([building, hives]) => (
        <div key={building}>
          <h3>{building}</h3>
          {hives.map(hive => (
            <div key={hive.HiveID} className="card">
              <div><b>Location:</b> {hive.Location}</div>
              <div><b>Status:</b> {hive.Status}</div>
              <div><b>Beekeeper:</b> {hive.BeekeeperName}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}