import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You do not have permission to access this resource.</p>
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}
