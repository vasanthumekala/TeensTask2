import { useAuth } from "../context/AuthContext";
import { apiClient } from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("employees");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, clientRes] = await Promise.all([
        apiClient.get("/getemployees"),
        apiClient.get("/getclients"),
      ]);

      setEmployees(empRes.data);
      setClients(clientRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <span className="user-role">{user?.role.toUpperCase()}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            Employees
          </button>
          <button
            className={`tab ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => setActiveTab("clients")}
          >
            Clients
          </button>
        </div>

        {loading && <div className="loading">Loading data...</div>}
        {error && <div className="error">{error}</div>}

        {activeTab === "employees" && !loading && (
          <div className="data-section">
            <h2>Employees</h2>
            {employees.length === 0 ? (
              <p>No employees found</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employee_id}>
                      <td>{emp.employee_id}</td>
                      <td>{`${emp.first_name} ${emp.last_name}`}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "clients" && !loading && (
          <div className="data-section">
            <h2>Clients</h2>
            {clients.length === 0 ? (
              <p>No clients found</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.client_id}>
                      <td>{client.client_id}</td>
                      <td>{client.client_name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
