import React, { useState, useEffect } from "react";
import { createUser, updateUser, getAllPermissions } from "../src/services/api";

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    isActive: true,
    permissions: []
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Predefined roles and their default permissions
  const rolePermissions = {
    admin: [
      "user:create", "user:read", "user:update", "user:delete",
      "beekeeper:create", "beekeeper:read", "beekeeper:update", "beekeeper:delete",
      "hive:create", "hive:read", "hive:update", "hive:delete",
      "species:create", "species:read", "species:update", "species:delete",
      "environment:create", "environment:read", "environment:update", "environment:delete",
      "plant:create", "plant:read", "plant:update", "plant:delete",
      "honey:create", "honey:read", "honey:update", "honey:delete"
    ],
    manager: [
      "beekeeper:read", "beekeeper:update",
      "hive:create", "hive:read", "hive:update",
      "species:read",
      "environment:read", "environment:update",
      "plant:read", "plant:update",
      "honey:create", "honey:read", "honey:update"
    ],
    user: [
      "beekeeper:read",
      "hive:read",
      "species:read",
      "environment:read",
      "plant:read",
      "honey:read"
    ]
  };

  useEffect(() => {
    // Load available permissions
    const loadPermissions = async () => {
      try {
        const permissions = await getAllPermissions();
        setAvailablePermissions(permissions);
      } catch (error) {
        console.error("Error loading permissions:", error);
        // Use default permissions if API fails
        setAvailablePermissions([
          "user:create", "user:read", "user:update", "user:delete",
          "beekeeper:create", "beekeeper:read", "beekeeper:update", "beekeeper:delete",
          "hive:create", "hive:read", "hive:update", "hive:delete",
          "species:create", "species:read", "species:update", "species:delete",
          "environment:create", "environment:read", "environment:update", "environment:delete",
          "plant:create", "plant:read", "plant:update", "plant:delete",
          "honey:create", "honey:read", "honey:update", "honey:delete"
        ]);
      }
    };
    loadPermissions();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.Username || "",
        email: initialData.Email || "",
        password: "",
        confirmPassword: "",
        role: initialData.Role || "user",
        isActive: initialData.IsActive !== undefined ? initialData.IsActive : true,
        permissions: initialData.permissions || []
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: rolePermissions[newRole] || []
    }));
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!initialData && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        permissions: formData.permissions
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      await onSubmit(userData);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const groupedPermissions = {
    "User Management": availablePermissions.filter(p => p.startsWith("user:")),
    "Beekeeper Management": availablePermissions.filter(p => p.startsWith("beekeeper:")),
    "Hive Management": availablePermissions.filter(p => p.startsWith("hive:")),
    "Species Management": availablePermissions.filter(p => p.startsWith("species:")),
    "Environment Management": availablePermissions.filter(p => p.startsWith("environment:")),
    "Plant Management": availablePermissions.filter(p => p.startsWith("plant:")),
    "Honey Management": availablePermissions.filter(p => p.startsWith("honey:"))
  };

  return (
    <div className="card-container">
      <div className="bee-sticker">🐝</div>
      <h2>{initialData ? "Edit User" : "Create New User"}</h2>
      
      {errors.submit && (
        <div style={{ color: "red", marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#ffe6e6", borderRadius: "4px" }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="username">👤 Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">📧 Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="password">🔒 {initialData ? "New Password" : "Password *"}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={initialData ? "Leave blank to keep current" : "Enter password"}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">🔐 Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="role">👑 Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>✅ Active Account</span>
            </label>
          </div>
        </div>

        <div className="permissions-section">
          <h3>🔐 Permissions</h3>
          <p className="permissions-description">
            Select the permissions this user should have. You can customize the default role permissions below.
          </p>
          <div className="permissions-grid" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#fafafa', marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              permissions.length > 0 && (
                <div key={category} className="permission-category">
                  <h4 className="category-title">{category}</h4>
                  <div className="permission-options">
                    {permissions.map(permission => (
                      <label key={permission} className="permission-option" style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                        />
                        <span className="permission-text" style={{ marginLeft: '0.5em' }}>
                          {permission.split(":")[1].charAt(0).toUpperCase() + permission.split(":")[1].slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={onCancel}
            className="button-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (initialData ? "Update User" : "Create User")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 