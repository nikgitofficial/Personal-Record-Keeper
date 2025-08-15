// frontend/src/pages/UserInfo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  // Fetch current user info
  useEffect(() => {
    axios
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then((res) => {
        setUser(res.data);
        setNewUsername(res.data.username);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle username update
  const handleSave = () => {
    axios
      .patch(
        "/api/auth/update-username",
        { username: newUsername },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      )
      .then((res) => {
        setUser(res.data.user);
        setEditMode(false);
      })
      .catch((err) => console.error(err));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>User Info</h2>

      <div style={{ marginBottom: "15px" }}>
        <strong>Email:</strong>
        <p>{user.email}</p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <strong>Username:</strong>
        {editMode ? (
          <>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            />
            <button onClick={handleSave} style={{ marginTop: "5px" }}>
              Save
            </button>
            <button onClick={() => setEditMode(false)} style={{ marginTop: "5px", marginLeft: "5px" }}>
              Cancel
            </button>
          </>
        ) : (
          <p>
            {user.username}{" "}
            <button onClick={() => setEditMode(true)} style={{ marginLeft: "10px" }}>
              Edit
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
