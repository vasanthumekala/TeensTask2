
import "../styles/Dashboard.css";

export default function Dashboard() {

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <p>This is a protected route. Only authenticated users can access this page.</p>
    </div>
  );
}
