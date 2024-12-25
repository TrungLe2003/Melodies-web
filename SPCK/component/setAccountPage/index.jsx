import "./style.css";
//
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Outlet } from "react-router-dom";
//
import ProfileModel from "../profileModel";
import User1 from "../../src/assets/User1";

const AccountPage = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [openProfileModel, setOpenProfileModel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");

  const openPModel = () => {
    if (openProfileModel) {
      setOpenProfileModel(false);
    } else {
      setOpenProfileModel("true");
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsLoggedIn(true);
        setRole(decoded.role);
        setEmail(decoded.email);
        console.log("email", email);
        console.log("role", role);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsLoggedIn(false);
      }
    }
  }, [token]);
  return (
    <div className="AccountPage">
      <div className="header">
        <div className="logo" onClick={() => nav("/")}>
          Melodies
        </div>
        <div className="actionFrameRight">
          <div className="SI-successful">
            <div className="avaUser" onClick={openPModel}>
              <User1></User1>
              <div className="emailUser">{email}</div>
            </div>
            <sup>{role}</sup>
            {openProfileModel && <ProfileModel></ProfileModel>}
          </div>
        </div>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default AccountPage;
