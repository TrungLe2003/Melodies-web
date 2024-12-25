import "./style.css";
//
import LogOutIcon from "../../src/assets/LogOutIcon";
import EditIcon from "../../src/assets/EditIcon";
//
import { useNavigate } from "react-router-dom";
const ProfileModel = () => {
  const nav = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    nav("/sign-in");
  };
  return (
    <div className="profileModal">
      <div className="accountBtn row" onClick={() => nav("/account")}>
        <div className="title">Account</div>
        <EditIcon></EditIcon>
      </div>
      <div className="profileBtn row" onClick={() => nav("/user")}>
        <div className="title">Profile</div>
      </div>
      <div className="line"></div>
      <div className="logOutBtn row" onClick={handleLogout}>
        <div className="title">Log out</div>
        <LogOutIcon></LogOutIcon>
      </div>
    </div>
  );
};

export default ProfileModel;
