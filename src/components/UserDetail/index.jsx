import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";
import "./styles.css";
function UserDetail() {
  const [User, setUser] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${id}`,
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching User:", error);
      }
    };

    fetchUser();
  }, [id]);

  if (!User) {
    return <Typography variant="body1">User not found.</Typography>;
  }


  return (
    <div className="User-detail-container">
      {" "}
      {/* Added container class */}
      <Typography variant="h6" className="detail-title">
        User Details:
      </Typography>{" "}
      {/* Added class for title */}
      <div className="detail-info">
        {" "}
        {/* Added class for detail info */}
        <Typography variant="body1">
          <strong>Name:</strong> {User.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {User.location}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {User.description}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {User.occupation}
        </Typography>
        <Typography variant="body1">
          <Link to={`/photos/${id}`} className="view-photos-link">
            View Photos
          </Link>{" "}
        </Typography>
      </div>
    </div>
  );
}

export default UserDetail;
