import "./App.css";

import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import UploadPhoto from "./components/UploadPhoto";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import PhotoDetail from "./components/PhotoDetail";

const App = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          navigate("/");
        }
      } catch (error) {
        setIsLoggedIn(false);
        navigate("/");
      }
    };
    if (location.pathname !== "/signup") {
      fetchUser();
    }
  }, []);

  return (
    <div className="contain">
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
              <Link to="/upload">
                <Button variant="primary">Upload Photo</Button>{" "}
                {/* Thêm nút Bootstrap */}
              </Link>
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/photos/:id" element={<UserPhotos />} />
                <Route path="/photos/:id/:photoId" element={<PhotoDetail />} />
                <Route path="/upload" element={<UploadPhoto />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default App;
