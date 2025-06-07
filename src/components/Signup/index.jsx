import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Login/styles.css";

function Signup() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (username == "" || password == "" || confirmPassword == "" || first_name == "" || last_name == "" || location == "" || description == "" || occupation == "") {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      setError("Vui lòng nhập lại mật khẩu");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/createUser",
        {
          first_name,
          last_name,
          location,
          description,
          occupation,
          username,
          password,
        }
      );

      if (response.status === 200) {
        alert("Đăng ký tài khoản thành công");
        navigate("/");
      }
    } catch (err) {
      console.error("Lỗi đăng kí:", err);
      if (err.response) {
        console.log("Lỗi data phản hồi:", err.response.data);
        console.log("Trạng thái lỗi:", err.response.status);
      }

      setError(
        err.response?.data?.message || "Đã xảy ra lỗi trong quá trình đăng kí"
      );
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSignup}>
        <div>
          <h3>Sign Up</h3>
          {error && <div className="error-message">{error}</div>}

          <div>
            <label>First Name:</label>
            <input
              type="text"
              placeholder="Enter First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label>Last Name:</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div >
            <label>Location:</label>
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label>Description:</label>
            <input
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Occupation:</label>
            <input
              type="text"
              placeholder="Enter Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          <div>
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <button className="button" type="submit" variant="primary">
              Submit
            </button>
          </div>

          <p>
            <a href="/">Back to login</a>   
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
