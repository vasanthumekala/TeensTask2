import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import { useAuth } from "../context/useAuth";
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { saveAuthentication } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const login = async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });
        const { jwt, user } = response.data;
        saveAuthentication(jwt, user);

        return { success: true, user };
      } catch (err) {
        const fieldErrors = err.response?.data?.errors;
        const specificError = fieldErrors
          ? Object.values(fieldErrors).flat()[0]
          : null;
        const errorMessage = err.response?.data?.message || "Login failed";
        const displayedError = specificError || errorMessage;
        setError(displayedError);
        return { success: false, error: displayedError };
      } finally {
        setLoading(false);
      }
    };
    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don&apos;t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
