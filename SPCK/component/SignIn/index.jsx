import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./style.css";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset lỗi trước đó
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/logIn",
        { email, password }
      );
      // console.log("Response:", response);
      // console.log("Response data:", response.data);

      // Kiểm tra nếu có dữ liệu trả về
      if (response && response.data) {
        const { accessToken, refreshToken, role } = response.data;
        // console.log("Response data:", response.data);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        alert("Login successful!");
        nav("/");
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error response:", err);

      // Log cho chi tiết
      if (err.response) {
        console.error("Response Error Data:", err.response.data);
        setError(err.response.data.message || "Something went wrong."); // lấy phần message của response
      } else if (err.request) {
        console.error("Request Error:", err.request);
        setError("Request made but no response received.");
      } else {
        console.error("Error Message:", err.message);
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signInP">
      <img src="./public/SignInWallpaper.png" alt="" />
      <div className="form-signIn">
        <h1 onClick={() => nav("/")}>Melodies</h1>
        <div className="wcBack">Login to continue</div>
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
          {error && <p className="error">{error}</p>}
          <br />
          <button className="submitBtn" type="submit">
            Login
          </button>
        </form>
        <div className="otherSignin">
          <div>
            <img src="./public/company_logo/FacebookLogo.png" alt="" />
            <button>Facebook login</button>
          </div>

          <div>
            <img src="./public/company_logo/ggLogo.png" alt="" />
            <button>Google login</button>
          </div>
        </div>
        <p class="text">
          <span>Don't have an account?</span>
          <span onClick={() => nav("/sign-up")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
