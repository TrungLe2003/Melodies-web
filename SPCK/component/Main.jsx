// component
import ProfileModel from "./profileModel";
//
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import jwt_decode from "jwt-decode"; //thư viện dùng để giải mã token
//
import User1 from "../src/assets/User1";
import FindIcon from "../src/assets/findIcon";
//
const MainPage = () => {
  const nav = useNavigate();
  const [openProfileModel, setOpenProfileModel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [searchText, setSearchText] = useState(null);

  const openPModel = () => {
    if (openProfileModel) {
      setOpenProfileModel(false);
    } else {
      setOpenProfileModel("true");
    }
  };

  const handleSearch = () => {
    if (searchText) {
      nav(`/search?q=${searchText}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        // Giải mã accessToken để lấy thông tin
        const decoded = jwt_decode(token);
        setIsLoggedIn(true);
        setRole(decoded.role); //này t có role ['user', 'artist' với 'admin']
        setEmail(decoded.email); // này là lấy email ra này (useState ấy)
      } catch (err) {
        console.error("Invalid token:", err);
        setIsLoggedIn(false);
      }
    }
  }, []);
  return (
    <>
      <div className="MP-header">
        <div className="hd-nameApp">
          <div className="nameApp" onClick={() => nav("/")}>
            Melodies
          </div>
        </div>
        <div className="MP-header-frame2">
          <div className="searchMusicFrame">
            <input
              type="text"
              className="Find-Music"
              placeholder="Search for music"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="btnFindSong" onClick={handleSearch}>
              <FindIcon></FindIcon>
            </button>
          </div>

          <div className="aboutUs">About us</div>
          <div className="Premium">Premium</div>
        </div>
        {isLoggedIn ? (
          <div className="SI-successful">
            <div className="avaUser" onClick={openPModel}>
              <User1></User1>
              <div className="emailUser">{email}</div>
            </div>
            <sup>{role}</sup>
            {openProfileModel && <ProfileModel></ProfileModel>}
          </div>
        ) : (
          <div className="frame-signUp-in">
            <button className="signin-btn" onClick={() => nav("/sign-in")}>
              Sign In
            </button>
            <button className="signup-btn" onClick={() => nav("/sign-up")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
      <Outlet></Outlet>
      <div className="footer">
        <div className="AboutUs">
          <h1>About us</h1>
          <p>
            Melodies brings you closer to the music you love, offering a
            seamless platform to discover, stream, and share your favorite
            tunes. With curated playlists and personalized recommendations, we
            make every listening moment special. Join us and let your days be
            filled with endless melodies.
          </p>
        </div>
        <div className="footerColumn">
          <h2>Melody</h2>
          <div className="line"></div>
          <div>Podcast</div>
          <div>Songs</div>
          <div>Radio</div>
        </div>

        <div className="footerColumn">
          <h2>Access</h2>
          <div className="line"></div>
          <div>Explore</div>
          <div>Artist</div>
          <div>Playlist</div>
        </div>
        <div className="footerColumn">
          <h2>Contact</h2>
          <div className="line"></div>
          <div>About</div>
          <div>Policy</div>
          <div>Social Media</div>
        </div>

        <div className="footer-logo">
          <div className="nameApp">Melodies</div>
        </div>
      </div>
      <div className="footer2"></div>
    </>
  );
};

export default MainPage;
