import "./styles.css";
import React, { useState } from "react";
import axios from "../axios";
import { useNavigate, Link } from "react-router-dom";

const PhotoUploadForm = () => {
  const [photo, setPhoto] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newPhotoId, setNewPhotoId] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  // const comment = [];

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photo) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("photo", photo);
      // formData.append("comments", comment)

      try {
        const authResponse = await axios.get(`http://localhost:5000/api/auth`);
        const retrievedUserId = authResponse.data.userId;
        formData.append("userId", retrievedUserId);

        const response = await axios.post(
          "http://localhost:5000/api/upload/photo",
          formData
        );
        setUploadResponse(response.data);
        setError(null);
        setUserId(retrievedUserId);
        setNewPhotoId(response.data.photo_id);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to upload photo.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please select a photo before uploading.");
    }
  };

  return (
    <div className="photo-upload-form">
      <h1 className="title">Upload Your Photo</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <button type="submit" className="upload-btn">Upload</button>
        </div>
      </form>

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {uploadResponse && (
        <div className="alert success">
          <h4>Upload Successful!</h4>
          <Link to={`/photos/${userId}/${newPhotoId}`}>
            View Your Photo
          </Link>
        </div>
      )}

      {error && (
        <div className="alert error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadForm;
