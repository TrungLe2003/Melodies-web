import "./style.css";
//
import { useEffect, useState } from "react";
import axios from "axios";
//
const AccPrivacyPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:8081/api/v1/user/changePassword",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Server response:", response.data);
      setMessage(response.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error object:", error);
      console.error("Error response from server:", error.response);
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Error response from server:", error.response);
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="AccPrivacyPage">
      <div className="contentAccPrivacyPage">
        <h1>Change pass word</h1>
        <div className="ChangePasswordForm">
          <div className="ChangePasswordFormframeRow">
            <label htmlFor="">Your current password</label>
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="text"
              placeholder="Current passwor"
            />
          </div>
          <div className="ChangePasswordFormframeRow">
            <label htmlFor="">Your new password</label>
            <input
              type="text"
              placeholder="New passwor"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="ChangePasswordFormframeRow">
            <label htmlFor="">Confirm password</label>
            <input
              type="text"
              placeholder="Confirm passwor"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit}>Save</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AccPrivacyPage;
