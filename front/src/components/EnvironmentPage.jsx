import React, { useState, useEffect } from "react";
import { getAllEnvironmentData } from "../services/api";

export default function EnvironmentPage() {
  const [environmentData, setEnvironmentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    getAllEnvironmentData().then(setEnvironmentData);
  }, []);

  const filteredData = environmentData.filter(item =>
    (item.Location && item.Location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.Date && item.Date.toLowerCase().includes(searchTerm.toLowerCase()))
    // add more fields as needed
  );

  const visible = filteredData.slice(0, visibleCount);

  return (
    <div>
      <h2>Environment Data</h2>
      <input
        type="text"
        placeholder="Search by location, date, or other field..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1em', padding: '0.5em', width: '100%' }}
      />
      {visible.map(row => (
        <div key={row.DataID} className="card">
          <div>🏠 <b>Hive:</b> {row.HiveID}</div>
          <div>📅 <b>Date:</b> {row.Date}</div>
          <div>🌡️ <b>Temperature:</b> {row.Temperature}°C</div>
          <div>💧 <b>Humidity:</b> {row.Humidity}%</div>
        </div>
      ))}
      {visible.length < filteredData.length && (
        <button onClick={() => setVisibleCount(c => c + 10)} style={{margin: "2em auto", display: "block"}}>
          Load More
        </button>
      )}
      {visible.length === 0 && <div>No environment data found.</div>}
    </div>
  );
}