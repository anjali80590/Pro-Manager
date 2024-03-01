import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AuthForm.module.css";
import Art from "../../images/Art.png";
import userIcon from "../../images/userIcon.png";
import emailIcon from "../../images/emailIcon.png";
import lockIcon from "../../images/lockIcon.png";
import eyeIcon from "../../images/eyeIcon.png";
import eyeSlashIcon from "../../images/eyeSlashIcon.png";
import BaseUrl from "../BaseUrl/BaseUrl";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const switchModeHandler = () => {
    setIsLogin((prevMode) => !prevMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const apiURL = isLogin
      ? `${BaseUrl}/user/login`
      : `${BaseUrl}/user/register`;

    if (!isLogin && data.password !== data.confirmPassword) {
      setIsLoading(false);
      return toast.error("Passwords do not match!");
    }

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "An error occurred";
        if (response.status === 409) {
          errorMessage = "Email already registered. Please log in.";
        } else if (result.message) {
          errorMessage = result.message;
        }
        throw new Error(errorMessage);
      }

      if (isLogin) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        navigate("/dashboard");
        toast.success("Logged in successfully!");
      } else {
        setIsLogin(true);
        toast.success("Registered successfully! Please log in.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <ToastContainer position="top-center" />
      <div className={styles.welcomeSection}>
        <div className={styles.circleBehindImage}></div>
        <img src={Art} alt="Astronaut" className={styles.astronautImage} />
        <h1 className={styles.welcomeTitle}>Welcome aboard my friend</h1>
        <p className={styles.welcomeSubtitle}>
          just a couple of clicks and we start
        </p>
      </div>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h2 className={styles.formTitle}>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <img src={userIcon} alt="User" className={styles.icon} />
              <input
                className={styles.formInput}
                type="text"
                name="name"
                placeholder="Name"
                required
              />
            </div>
          )}
          <div className={styles.inputGroup}>
            <img src={emailIcon} alt="Email" className={styles.icon} />
            <input
              className={styles.formInput}
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <img
                src={lockIcon}
                alt="Confirm Password"
                className={styles.icon}
              />
              <input
                className={styles.formInput}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                className={styles.toggleIcon}
                onClick={toggleShowConfirmPassword}
              >
                <img
                  src={showConfirmPassword ? eyeSlashIcon : eyeIcon}
                  alt="Toggle Confirm Password Visibility"
                  className={`${styles.img} ${
                    showConfirmPassword ? styles.eyeSlashIcon : ""
                  }`}
                />
              </button>
            </div>
          )}
          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="Password" className={styles.icon} />
            <input
              className={styles.formInput}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className={styles.toggleIcon}
              onClick={toggleShowPassword}
            >
              <img
                src={showPassword ? eyeSlashIcon : eyeIcon}
                alt="Toggle Password Visibility"
                className={`${styles.img} ${
                  showPassword ? styles.eyeSlashIcon : ""
                }`}
              />
            </button>
          </div>
          <button
            className={styles.formButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.loader}></div>
            ) : isLogin ? (
              "Log in"
            ) : (
              "Register"
            )}
          </button>
          <p className={styles.switchText}>
            {isLogin ? "Have No account yet? " : "Have an account? "}
            <br />
            <span className={styles.switchButton} onClick={switchModeHandler}>
              {isLogin ? "Register" : "Log in"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
