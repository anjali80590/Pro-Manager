import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import userIcon from "../../images/userIcon.png";
import lockIcon from "../../images/lockIcon.png";
import eyeIcon from "../../images/eyeIcon.png";
import eyeSlashIcon from "../../images/eyeSlashIcon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseUrl from "../BaseUrl/BaseUrl";

const SettingsForm = () => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setErrorMessage] = useState("");
  const [success, setSuccessMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserName = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`${BaseUrl}/user/getName`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error("Fetching user name failed", error);
        setErrorMessage("Failed to fetch user name");
      } finally {
        setIsFetching(false);
      }
    };

    if (token) {
      fetchUserName();
    } else {
      setErrorMessage("Authentication token is not available.");
      setIsFetching(false);
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      oldPassword: oldPassword.toString(),
      newPassword: newPassword.toString(),
    };

    try {
      const response = await fetch(`${BaseUrl}/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error("Error updating settings");
      }

      setSuccessMessage("Settings updated successfully");
      setOldPassword("");
      setNewPassword("");
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Updating settings failed", error);
      setErrorMessage("Failed to update settings");
      toast.error("Failed to update settings");
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.settingsWrapper}>
      <ToastContainer position="top-center" />
      <div className={styles.body}>
        <div className={styles.title}>Settings</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <img src={userIcon} alt="User" className={styles.nameIcon} />
            <input
              type="text"
              value={name}
              readOnly
              className={styles.input}
              placeholder="Name"
            />
          </div>
          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="Lock" className={styles.inputIcon} />
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={styles.input}
              placeholder="Old Password"
              autoComplete="off"
            />

            <div
              className={styles.eyeIcon}
              onClick={toggleOldPasswordVisibility}
            >
              {showOldPassword ? (
                <img
                  src={eyeSlashIcon}
                  alt="Hide"
                  className={`${styles.eyeIconImg} ${styles.eyeSlashIcon}`}
                />
              ) : (
                <img src={eyeIcon} alt="Show" className={styles.eyeIconImg} />
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="Lock" className={styles.inputIcon} />
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              placeholder="New Password"
            />

            <div
              className={styles.eyeIcon}
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? (
                <img
                  src={eyeSlashIcon}
                  alt="Hide"
                  className={`${styles.eyeIconImg} ${styles.eyeSlashIcon}`}
                />
              ) : (
                <img src={eyeIcon} alt="Show" className={styles.eyeIconImg} />
              )}
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.updateButton}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
