import { useEffect, useState } from "react";
import { getAllBeeSpecies } from "../services/api";

export default function BeeSpeciesSearchBar({ selected, onChange }) {
  const [species, setSpecies] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllBeeSpecies().then(setSpecies);
  }, []);

  const filtered = species.filter(sp =>
    sp.CommonName.toLowerCase().includes(query.toLowerCase()) ||
    sp.ScientificName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bee-species-searchbar">
      <input
        type="text"
        placeholder="Search bee species..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="bee-species-input"
        style={{ marginBottom: "1em" }}
      />
      <div className="bee-species-list">
        <div
          className={`bee-species-item${selected === null ? " selected" : ""}`}
          onClick={() => {
            onChange(null);
          }}
        >
          All Species
        </div>
        {filtered.map(sp => (
          <div
            key={sp.SpeciesID}
            className={`bee-species-item${selected === sp.SpeciesID ? " selected" : ""}`}
            onClick={() => {
              onChange(sp.SpeciesID);
            }}
          >
            {sp.CommonName} <span className="sci-name">({sp.ScientificName})</span>
          </div>
        ))}
      </div>
    </div>
  );
}