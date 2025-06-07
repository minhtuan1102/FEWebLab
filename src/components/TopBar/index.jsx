import React, { useEffect, useState} from "react";
import { AppBar, Toolbar, Typography} from "@mui/material";
import { useLocation, useParams, Link} from "react-router-dom";
import "./styles.css";
import axios from "../axios";
import Button from "react-bootstrap/Button";
import useStyles from "./styles";


function TopBar() {
  const classes = useStyles();
  const [appContext, setAppContext] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = location.pathname.slice(7);
        const response = await axios.get(`http://localhost:5000/api/user/${id}`);
        const user = response.data;
        const fullname = user.last_name;

        if (location.pathname.includes("/users/")) {
          setAppContext(`Information of User ${fullname}`);
        } else if (location.pathname.includes("/photos")) {
          setAppContext(`Photos of User ${fullname}`);
        } else {
          setAppContext("");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  } , [location]);


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth`);
        if (response.data.success) {
          console.log("User info:", response.data);
          setLastName(response.data.last_name);
          setUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);


  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className={classes.fab1}>
        <Typography variant="h6" color="inherit" className="app-context">
          {appContext ? `${appContext}` : `Hi ${lastName}`}
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" className="user-info">
            <Link to={`/users/${userId}`} style={{ color: "white", textDecoration: "none" }}>{lastName}</Link>
          </Typography>
          <Button onClick={handleLogout} variant="light" className="logout-button">
            Log Out
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
