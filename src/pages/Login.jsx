import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {

  e.preventDefault();

  if (!email || !password) {

    alert("Please enter email and password");

    return;

  }


  try {

    const response = await api.post("/login", {

      Email: email,

      Password: password,

    });


    localStorage.setItem("token", response.data.token);


    alert("Login successful!");


    navigate("/dashboard");


  } catch (error) {


    alert(
      error.response?.data?.message || "Login failed!"
    );


  }

}

  return (
    <div style={{ padding: "40px" }}>
      <h1>TaskFlow Login</h1>

      <form onSubmit={handleLogin}>

        <div>
          <label>Email:</label>
          <br />

          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password:</label>
          <br />

          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;