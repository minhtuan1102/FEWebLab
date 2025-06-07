import React, { useState } from "react";
import "./styles.css";
import axios from "axios"; 
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Login() {
  const [username, setusername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 
  const handleLogin = async () => {
    if (username == "" || password == "") {
      setError("Vui lòng nhập username và password");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/login",
          {
            username,
            password,
          },
        );
        if (response.data.success) {
          localStorage.setItem("authToken", response.data.token);
          window.location.reload();
        }
      } catch (err) {
        setError(err.response.data.message);
      }
    }
  };
  return (
    <div className="login-form">
      <form>
        <h3>Login</h3>
        {error && <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>}

        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setusername(e.target.value)}
            type="text"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Button className="button" onClick={handleLogin}>
            Submit
          </Button>
        </div>

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;


