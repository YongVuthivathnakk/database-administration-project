import { useEffect, useState } from "react";
import { getAllBeeSpecies, getHivesBySpecies } from "../services/api";

export default function BeeSpeciesPage() {
  const [species, setSpecies] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [hives, setHives] = useState([]);

  useEffect(() => { getAllBeeSpecies().then(setSpecies); }, []);
  useEffect(() => {
    if (selected) getHivesBySpecies(selected).then(setHives);
    else setHives([]);
  }, [selected]);

  const filtered = species.filter(sp =>
    sp.CommonName.toLowerCase().includes(query.toLowerCase()) ||
    sp.ScientificName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2>🐝 Bee Species</h2>
      <input
        type="text"
        placeholder="Search bee species... 🐝"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="bee-species-input"
        style={{ marginBottom: "1em" }}
      />
      <div className="bee-species-list">
        <div
          className={`bee-species-item${selected === null ? " selected" : ""}`}
          onClick={() => setSelected(null)}
        >
          🐝 All Species
        </div>
        {filtered.map(sp => (
          <div
            key={sp.SpeciesID}
            className={`bee-species-item${selected === sp.SpeciesID ? " selected" : ""}`}
            onClick={() => setSelected(sp.SpeciesID)}
          >
            🐝 {sp.CommonName} <span className="sci-name">({sp.ScientificName})</span>
          </div>
        ))}
      </div>
      {selected && (
        <div>
          <h3>🏠 Hives with this Species</h3>
          {hives.map(hive => (
            <div key={hive.HiveID} className="card">
              <div>🏠 <b>Location:</b> {hive.Location}</div>
              <div>📋 <b>Status:</b> {hive.Status}</div>
              <div>🧑‍🌾 <b>Beekeeper:</b> {hive.BeekeeperName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}