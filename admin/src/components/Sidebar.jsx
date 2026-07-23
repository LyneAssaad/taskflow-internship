import { Link } from "react-router-dom"

function Sidebar() {
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

        <li style={{ margin: "15px 0" }}>
          Logout
        </li>

      </ul>
    </div>
  )
}

export default Sidebar