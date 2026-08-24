import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import "../styles/Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

const dataTabs = [
  { key: "admin", label: "Admins", endpoint: "admin" },
  { key: "employee", label: "Employees", endpoint: "employee" },
  { key: "manager", label: "Managers", endpoint: "manager" },
];

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("admin");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const selectedTab = dataTabs.find((tab) => tab.key === activeTab);
    let isCurrentRequest = true;

    const fetchRecords = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/${selectedTab.endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isCurrentRequest) {
          setRecords(
            Array.isArray(response.data.result) ? response.data.result : [],
          );
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setRecords([]);
          setError(
            requestError.response?.data?.message ||
              "Unable to retrieve data from the server.",
          );
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    fetchRecords();

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, token]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-mark">
            <span className="brand-dot" aria-hidden="true" />
            <span>Taskspace</span>
          </div>
          <button type="button" className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-panel">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h1>Welcome{user?.name ? `, ${user.name}` : " back"}</h1>
            <p className="welcome-copy">
              Keep your tasks moving and your priorities in view.
            </p>
          </div>
          <div className="welcome-accent" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        {user && (
          <section className="user-info" aria-labelledby="user-info-heading">
            <h2 id="user-info-heading">User Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <span className="field-label">Name</span>
                <strong>{user.name}</strong>
              </div>
              <div className="profile-field">
                <span className="field-label">Email</span>
                <strong>{user.email}</strong>
              </div>
              <div className="profile-field">
                <span className="field-label">Role</span>
                <strong className="role-badge">{user.role}</strong>
              </div>
            </div>
          </section>
        )}

        <section
          className="directory-section"
          aria-labelledby="directory-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">People directory</p>
              <h2 id="directory-heading">Browse your team</h2>
            </div>
            <span className="record-count">
              {loading
                ? "Loading"
                : `${records.length} ${records.length === 1 ? "person" : "people"}`}
            </span>
          </div>

          <div className="data-tabs" role="tablist" aria-label="Team data">
            {dataTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`data-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="table-state">Loading {activeTab} data...</div>
          )}

          {!loading && error && (
            <div className="table-state error-state" role="alert">
              <strong>{error}</strong>
              <span>Try selecting this tab again in a moment.</span>
            </div>
          )}

          {!loading && !error && records.length === 0 && (
            <div className="table-state">
              No {activeTab} records were found.
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const recordId =
                      record.id ||
                      record.admin_id ||
                      record.manager_id ||
                      record.employee_id;

                    return (
                      <tr key={recordId}>
                        <td data-label="ID">{recordId || "-"}</td>
                        <td data-label="Name">{record.name || "-"}</td>
                        <td data-label="Email">{record.email || "-"}</td>
                        <td data-label="Phone">
                          {record.phone || record.phone_number || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
