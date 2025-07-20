import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../src/services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshPressed, setRefreshPressed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    // if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
    //   try {
    //     await deleteUser(userId);
    //     setUsers(users.filter(user => user.UserID !== userId));
    //   } catch (error) {
    //     console.error("Error deleting user:", error);
    //     alert("Failed to delete user. Please try again.");
    //   }
    // }
  };

  const handleRefresh = async () => {
    setRefreshPressed(true);
    await loadUsers();
    setTimeout(() => setRefreshPressed(false), 300); // Reset after 300ms
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.Email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.Role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.IsActive) ||
                         (statusFilter === "inactive" && !user.IsActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // const getRoleBadgeColor = (role) => {
  //   switch (role) {
  //     case "admin": return "#dc3545";
  //     case "manager": return "#fd7e14";
  //     case "user": return "#28a745";
  //     default: return "#6c757d";
  //   }
  // };

  // const getStatusBadgeColor = (isActive) => {
  //   return isActive ? "#28a745" : "#dc3545";
  // };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString();
  // };

  if (loading) {
    return (
      <div className="card-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "1.2rem", color: "var(--bee-brown)" }}>Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
          <button onClick={loadUsers} className="button primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>User Management</h2>
        <Link to="/users/create" className="button primary">
          + Add New User
        </Link>
      </div>

      {/* Filters */}
      {/* <div className="filters-section">
        <div className="filters-grid" style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          minHeight: '48px',
          width: '100%'
        }}>
            <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '56px' }}>
              <label htmlFor="search" style={{ marginBottom: 2, fontSize: '0.95rem' }}>🔍 Search Users</label>
              <input
                type="text"
                id="search"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '40px', minWidth: '180px', boxSizing: 'border-box', padding: '0 12px', fontSize: '1rem', margin: 0 }}
              />
            </div>

            <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '56px' }}>
              <label htmlFor="roleFilter" style={{ marginBottom: 2, fontSize: '0.95rem' }}>👤 Role</label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  height: '40px',
                  minWidth: '140px',
                  maxWidth: '180px',
                  padding: '0 12px',
                  fontSize: '1rem',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  appearance: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '56px' }}>
              <label htmlFor="statusFilter" style={{ marginBottom: 2, fontSize: '0.95rem' }}>📊 Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: '40px',
                  minWidth: '140px',
                  maxWidth: '180px',
                  padding: '0 12px',
                  fontSize: '1rem',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  appearance: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group button-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '56px' }}>
              <label style={{ marginBottom: 2, fontSize: '0.95rem', visibility: 'hidden' }}>Refresh</label>
              <button
                onClick={handleRefresh}
                style={{
                  background: refreshPressed ? "#fffbe6" : "#ffe082",
                  color: refreshPressed ? "#b48a3c" : "#6d4c00",
                  border: `2px solid #ffe082`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  padding: "0.5em 1.5em",
                  fontWeight: 600,
                  boxShadow: refreshPressed ? '0 0 0 2px #ffe082' : 'none',
                  transition: "all 0.2s",
                  minWidth: '120px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  margin: 0
                }}
              >
                {refreshPressed ? "Refreshing..." : "Refresh"}
              </button>
            </div>
        </div>
      </div> */}

      {/* Users List */}
      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            {searchTerm || roleFilter !== "all" || statusFilter !== "all" 
              ? "No users match your filters." 
              : "No users found."}
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.UserID} className="user-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <h3 className="user-name">{user.Username}</h3>
                    {/* <span style={{
                      backgroundColor: getRoleBadgeColor(user.Role),
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "bold"
                    }}>
                      {user.Role.toUpperCase()}
                    </span>
                    <span style={{
                      // backgroundColor: getStatusBadgeColor(user.IsActive),
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "bold"
                    }}>
                      {user.IsActive ? "ACTIVE" : "INACTIVE"}
                    </span> */}
                  </div>
                  
                  <div className="user-info">
                    <div><strong>Email:</strong> email </div>
                    {/* {user.LastLogin && (
                      <div><strong>Last Login:</strong> {formatDate(user.LastLogin)}</div>
                    )} */}
                  </div>

                  {/* {user.Permissions && user.Permissions.length > 0 && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <strong>Permissions:</strong>
                      <div style={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: "0.25rem", 
                        marginTop: "0.25rem" 
                      }}>
                        {user.Permissions.slice(0, 5).map(permission => (
                          <span key={permission} className="permission-badge">
                            {permission.split(":")[1]}
                          </span>
                        ))}
                        {user.Permissions.length > 5 && (
                          <span className="permission-badge" style={{
                            backgroundColor: "var(--bee-brown)",
                            color: "white"
                          }}>
                            +{user.Permissions.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )} */}
                </div>

                <div className="user-actions">
                  <button
                    // onClick={() => navigate(`/users/edit/${user.UserID}`)}
                    className="button-secondary"
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </button>
                  <button
                    // onClick={() => handleDeleteUser(user.UserID, user.Username)}
                    className="button-tertiary"
                    style={{ color: "#dc3545", borderColor: "#dc3545" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="summary-section">
        <div className="summary-grid">
          <div className="summary-item">
            <strong>👥 Total Users</strong>
            <span>{users.length}</span>
          </div>
          {/* <div className="summary-item">
            <strong>✅ Active Users</strong>
            <span>{users.filter(u => u.IsActive).length}</span>
          </div> */}
          {/* <div className="summary-item">
            <strong>👑 Admins</strong>
            <span>{users.filter(u => u.Role === "admin").length}</span>
          </div> */}
          {/* <div className="summary-item">
            <strong>📋 Managers</strong>
            <span>{users.filter(u => u.Role === "manager").length}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserList; 