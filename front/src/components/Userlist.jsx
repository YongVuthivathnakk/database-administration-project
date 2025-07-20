import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../services/api";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers().then(setUsers);
    }, []);



    // Filter and paginate
    const filtered = users.filter(user => {
        if (!search.trim()) return true; // Show all if search is empty
        if (!user.user) return false; // Hide only if searching and no name
        return user.user.toLowerCase().includes(search.toLowerCase());
    });
    const visible = filtered.slice(0, visibleCount);

    // Debug log
    console.log('Loaded users:', users);

    return (
        <div className="beekeeper-list">
            <h2>Users</h2>
            <button
                onClick={() => navigate("/users/create")}
                className="button primary"
                style={{ marginBottom: "1em" }}
            >
                + Add Users
            </button>
            <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: "1em", padding: "0.5em", width: "100%" }}
            />
            {
                visible.map((user, index) => (
                    <div key={index} className="beekeeper-item">
                        User: {user.user}
                        <div className="beekeeper-info">
                            <div>Host: {user.host}</div>
                            <div>Permissions: {user.privileges}</div>
                        </div>
                    </div>
                ))
            }
            {visible.length < filtered.length && (
        <button onClick={() => setVisibleCount(c => c + 10)} style={{margin: "2em auto", display: "block"}}>
          Load More
        </button>
      )}
      {filtered.length === 0 && <div>No beekeepers found for this location.</div>}
        </div>
    );
}