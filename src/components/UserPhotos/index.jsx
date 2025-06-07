import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./styles.css";
import useFetchCommentUsers from "../CustomHook/useFetchCommentUsers";


function UserPhotos() {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userMap, setUserMap] = useState({});
  const [comment, setComment] = useState([]);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/photo/${id}`,
        );
        const response2 = await axios.get(
          `http://localhost:5000/api/user/${id}`,
        );
        setPhotos(response.data);
        setUser(response2.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photo:", error);
        setLoading(false);
      }
    };
    const interval = setInterval(() => {
      fetchPhoto();
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 1500);
    }
  }, []);

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
          console.log("User ID:", response.data.userId);
          setCurrentUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useFetchCommentUsers(photos, userMap, setUserMap);

  const handleComment = async (e) => {
    e.preventDefault();
    const photoId = e.target.elements.photo_id.value;
    const userId = e.target.elements.user_id.value;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/write/comment",
        {
          photoId,
          user_id: currentUserId, 
          comment,
        },
      );
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <div className="user-photos-container">
      <Typography variant="body1">User Photos:</Typography>
      {loading ? (
        <Typography variant="body1">Loading photos...</Typography>) 
        : photos.length > 0 ? (
          photos.map((photo, index) => {
            if (!photo || !photo._id) {
              console.error("Photo is undefined or missing _id at index:", index);
              return null;
            }

            return (
              <div className="photo-item" id={photo._id} key={photo._id}>
                <Link to={`/photos/${id}/${photo._id}`}>
                <img
                  src={`${photo.file_name}`}
                  alt={`Photo ${photo._id}`}
                />
              </Link>
                {/* <img
                  src={`${photo.file_name}`}
                  alt={`Photo ${photo._id}`}
                /> */}
                <div className="photo-info">
                  <Typography variant="body1">
                    Date/Time:{" "}
                    {new Date(photo.date_time).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                    })}
                  </Typography>
                  <Typography variant="body1">Comments:</Typography>

                  {photo.comments && photo.comments.length > 0 ? (
                    photo.comments.map((comment, commentIndex) => {
                      if (!comment || !comment._id) {
                        console.error(
                          "Comment is undefined or missing _id at index:",
                          commentIndex
                        );
                        return null;
                      }

                      return (
                        <div className="comment-item" key={comment._id}>
                          <Typography variant="body1">
                            {new Date(comment.date_time).toLocaleString("vi-VN", {
                              timeZone: "Asia/Ho_Chi_Minh",
                              hour12: false,
                            })}
                          </Typography>
                          <Typography variant="body1" id={comment._id}>
                            <Link to={`/users/${comment.user_id}`}>{userMap[comment.user_id]?.last_name}</Link>
                            : {comment.comment}
                          </Typography>
                        </div>
                      );
                    })
                  ) : (
                    <Typography variant="body1">No comments yet.</Typography>
                  )}
                  <>
                    <h3>Write your comment</h3>
                    <Form
                      onSubmit={handleComment}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <div
                        className="form-group"
                        style={{ width: "90%", marginRight: "5px" }}
                      >
                        <input
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Your comment"
                        />
                      </div>
                      <input type="hidden" name="photo_id" value={photo._id} />
                      <input type="hidden" name="user_id" value={user._id} />

                      <Button type="submit" variant="primary">
                        Ok
                      </Button>
                    </Form>
                  </>
                </div>
              </div>
          );
        })
      ) : (
        <Typography variant="body1">No photos found for this user.</Typography>
      )}
    </div>
  );
}

export default UserPhotos;
