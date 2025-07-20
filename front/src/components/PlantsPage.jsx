import { useEffect, useState } from "react";
import { getAllPlants } from "../services/api";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => { getAllPlants().then(setPlants); }, []);

  const filtered = plants.filter(plant =>
    plant.PlantName.toLowerCase().includes(query.toLowerCase())
  );

  // Group by PlantName
  const grouped = filtered.reduce((acc, plant) => {
    acc[plant.PlantName] = acc[plant.PlantName] || [];
    acc[plant.PlantName].push(plant);
    return acc;
  }, {});

  return (
    <div>
      <h2>🌻 Plants Nearby</h2>
      <input
        type="text"
        placeholder="Search plants... 🌱"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="bee-species-input"
        style={{ marginBottom: "1em" }}
      />
      {Object.entries(grouped).map(([plant, list]) => (
        <div key={plant}>
          <h3>🌼 {plant}</h3>
          {list.map(item => (
            <div key={item.PlantID} className="card">
              <div>🏠 <b>Hive:</b> {item.HiveID}</div>
              <div>📏 <b>Distance:</b> {item.DistanceM}m</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}