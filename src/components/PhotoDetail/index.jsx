import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useFetchCommentUsers from "../CustomHook/useFetchCommentUsers";


function PhotoDetail() {
  const { id, photoId } = useParams(); 
  console.log(id, photoId);
  const [photo, setPhoto] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [comment, setComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchPhotoDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/photo/${id}/${photoId}`
        );
        setPhoto(response.data);
      } catch (error) {
        console.error("Error fetching photo detail:", error);
      }
    };

    fetchPhotoDetail();
  }, [id, photoId]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setCurrentUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  console.log("Mảng photo", photo);

  useFetchCommentUsers(photo, userMap, setUserMap);

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/write/comment", {
        photoId,
        user_id: currentUserId,
        comment,
      });
      setComment("");
      // Có thể bạn muốn load lại comment hoặc cập nhật photo để hiển thị comment mới
    } catch (err) {
      console.error("Error writing comment:", err);
    }
  };

  return (
    <div className="photo-detail-container">
      <Typography variant="h6">Photo Detail</Typography>
      {photo ? (
        <div className="photo-item" id={photo._id}>
          <img src={`${photo.file_name}`} alt="photo" />
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
              photo.comments.map((comment) => (
                <div className="comment-item" key={comment._id}>
                  <Typography variant="body2">
                    {new Date(comment.date_time).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                    })}
                  </Typography>
                  <Typography variant="body1">
                    <Link to={`/users/${comment.user_id}`}>
                      {userMap[comment.user_id]?.last_name || "Unknown"}
                    </Link>
                    : {comment.comment}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2">No comments yet.</Typography>
            )}

            <h4>Write your comment</h4>
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
              <Button type="submit" variant="primary">
                Ok
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <Typography variant="body1">Loading photo detail...</Typography>
      )}
    </div>
  );
}

export default PhotoDetail;
