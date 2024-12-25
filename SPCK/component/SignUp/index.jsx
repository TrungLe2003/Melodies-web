import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const SignUpPage = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate tại FE
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (email.length < 6) {
      setErrorMessage("Email must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password must match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        {
          email,
          password,
          phoneNumber,
        }
      );

      // Xử lý khi đăng ký thành công
      alert("Registration Successful");
      console.log("Registration Successful:", response.data);
      // Chuyển hướng hoặc hiển thị thông báo thành công
      nav("/sign-in");
    } catch (error) {
      console.error("Registration Failed:", error.response.data);
      setErrorMessage(error.response.data.message || "An error occurred.");
    }
  };

  return (
    <div className="signInP">
      <img src="./public/SignInWallpaper.png" alt="" />
      <div className="form-signIn">
        <h1 onClick={() => nav("/")}>Melodies</h1>
        <div className="wcBack">Sign up to continue</div>
        <form action="" onSubmit={handleSubmit}>
          <div className="account">Email</div>
          <input
            className="account"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password">Password</div>
          <input
            className="password"
            placeholder="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="password">Confirm password</div>
          <input
            className="account"
            type="text"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="account">Phone number</div>
          <input
            className="account"
            type="text"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <br />
          <button className="submitBtn" type="submit">
            Create Account
          </button>
        </form>
        <p class="text">
          <span>Already have an account?</span>
          <a href="" class="text-link">
            <span>Sign in</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
