import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  async function handleLogin(e) {

    e.preventDefault();

    // Clear previous message
    setMessage("");

    if (!email || !password) {

      setMessage("Please enter email and password");
      setMessageType("error");

      return;

    }

    try {

      const response = await api.post("/login", {

        Email: email,
        Password: password,

      });


      localStorage.setItem("token", response.data.token);


      setMessage("Login successful!");
      setMessageType("success");


      setTimeout(() => {

        setMessage("");

        navigate("/dashboard");

      }, 2000);


    } catch (error) {


      setMessage(
        error.response?.data?.message || "Login failed!"
      );

      setMessageType("error");


      setTimeout(() => {

        setMessage("");

      }, 2000);


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


        {message && (

          <p
            style={{
              color: messageType === "success" ? "green" : "red",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >

            {messageType === "success" ? "✅ " : "❌ "}
            {message}

          </p>

        )}


        <button type="submit">
          Login
        </button>


      </form>


    </div>
  );
}

export default Login;