import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHivesByBeekeeper } from "../services/api";
import BeeSpeciesSearchBar from "./BeeSpeciesSearchBar";

export default function BeekeeperHivesPage() {
  const { id } = useParams();
  const [hives, setHives] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState(null);

  useEffect(() => {
    getHivesByBeekeeper(id).then(setHives);
  }, [id]);

  const filteredHives = speciesFilter
    ? hives.filter(hive => hive.SpeciesID === speciesFilter)
    : hives;

  return (
    <div className="card-container">
      <h2>Hives for Beekeeper #{id}</h2>
      <BeeSpeciesSearchBar selected={speciesFilter} onChange={setSpeciesFilter} />
      {filteredHives.length === 0 && <div>No hives found for this filter.</div>}
      {filteredHives.map(hive => (
        <div className="card" key={hive.HiveID}>
          <div><b>Location:</b> {hive.Location}</div>
          <div><b>Status:</b> {hive.Status}</div>
          <div><b>Install Date:</b> {hive.InstallDate}</div>
          <div>
            <b>Bee Species:</b> {hive.BeeSpeciesName} <span className="sci-name">({hive.ScientificName})</span>
          </div>
          <div><b>Queen:</b> {hive.QueenID ? `#${hive.QueenID} (Born: ${hive.QueenBirthDate})` : "No queen info"}</div>
        </div>
      ))}
    </div>
  );
}