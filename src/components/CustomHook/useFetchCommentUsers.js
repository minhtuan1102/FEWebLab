import { useEffect } from "react";
import axios from "axios";

const useFetchCommentUsers = (photos, userMap, setUserMap) => {
  useEffect(() => {
    const photosArray = Array.isArray(photos) ? photos : [photos];
    if (photos.length === 0) return;

    const fetchCommentUsers = async () => {
      const map = { ...userMap };

      for (const photo of photosArray) {
        for (const comment of photo.comments || []) {
          const userId = comment.user_id;
          if (userId && !map[userId]) {
            try {
              const res = await axios.get(`http://localhost:5000/api/user/${userId}`);
              map[userId] = res.data;
            } catch (err) {
              console.error("Failed to fetch user for comment:", err);
            }
          }
        }
      }

      setUserMap(map);
    };

    fetchCommentUsers();
  }, [photos]);
};

export default useFetchCommentUsers;

