import { useAuth } from "../context/useAuth";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();

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
      </main>
    </div>
  );
}
