import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user); // Call the parent's onLogin function
      navigate("/users");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-container">
      <div className="bee-sticker">🐝</div>
      <h2>Login to Smart Beekeeper Database</h2>
      
      {error && (
        <div style={{ 
          color: "red", 
          marginBottom: "1rem", 
          padding: "0.5rem", 
          backgroundColor: "#ffe6e6", 
          borderRadius: "4px" 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-field">
          <label htmlFor="username">👤 Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">🔒 Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="actions">
          <button
            type="submit"
            className="button primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

              <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          <strong>Default Login Credentials:</strong>
        </p>
        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "1rem", 
          borderRadius: "8px",
          border: "1px solid #dee2e6"
        }}>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Note:</strong> This authenticates against the MySQL database</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 