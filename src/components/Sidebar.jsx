import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  function handleLogout() {

    localStorage.removeItem("token");

    navigate("/");

  }

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>TaskFlow</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>

        <li style={{ margin: "15px 0" }}>
          <Link to="/dashboard" style={{ color: "white" }}>
            Dashboard
          </Link>
        </li>

        <li style={{ margin: "15px 0" }}>
          <Link to="/projects" style={{ color: "white" }}>
            Projects
          </Link>
        </li>

        <li style={{ margin: "15px 0" }}>
          <Link to="/tasks" style={{ color: "white" }}>
            Tasks
          </Link>
        </li>

        <li
          onClick={handleLogout}
          style={{
            margin: "15px 0",
            cursor: "pointer",
            color: "white",
          }}
        >
          Logout
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;