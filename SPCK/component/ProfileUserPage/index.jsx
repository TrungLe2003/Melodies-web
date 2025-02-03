import "./style.css";
//
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
`//
import User2 from "../../src/assets/User2";
import CopyIcon from "../../src/assets/CopyIcon";
import EditIcon2 from "../../src/assets/EditIcon2";
import CatComponent from "../../src/assets/Cat";
//
import UploadSongFrame from "../UploadSongFrame";
const ProfileUserPage = () => {
  const nav = useNavigate();
  //Lấy token ra
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwt_decode(accessToken);
  const userId = decoded.id;
  //
  const [openMenuSettingModel, setOpenMenuSettingModel] = useState(false);
  const [openSettingModel, setOpenSettingModel] = useState(false);
  //Cho phần chỉnh sửa thông tin User
  const [settingName, setSettingName] = useState("");
  const [settingPhoneNumber, setSettingPhoneNumber] = useState("");
  const [settingAge, setSettingAge] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); //này để gửi file làm ava
  const [avaImg, setAvaImg] = useState(null); // này lấy cái trên làm ava :))
  //Cho artist
  const [artistName, setArtistName] = useState("");
  const [artistDescribe, setArtistDescribe] = useState("");
  const [artistBackgroundImg, setArtistBackgroundImg] = useState(null);
  const [artistImg, setArtistImg] = useState(null);
  //
  const [artistInfo, setArtistInfor] = useState(null);

  const [role, setRole] = useState("");
  const OnOpenMenuSettingModel = () => {
    if (openMenuSettingModel) {
      setOpenMenuSettingModel(false);
    } else {
      setOpenMenuSettingModel(true);
    }
  };

  const OnOpenSettingModel = () => {
    setOpenSettingModel(true);
    setOpenMenuSettingModel(false);
  };

  //Kết nối API, cập nhật thông tin cho user
  const handleSave = async () => {
    if (!accessToken) {
      alert("You must sign in");
      return;
    }
    console.log(accessToken);

    const formData = new FormData(); //sử dụng object để phù hợp với truyền file hơn
    formData.append("file", selectedFile); //đoạn này phải trùng với upload.single("file")) trong be
    formData.append("userName", settingName);
    formData.append("age", settingAge);
    formData.append("phoneNumber", settingPhoneNumber);

    try {
      const response = await axios.put(
        "http://localhost:8081/api/v1/user/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", //đoạn này kiểu định dạng gửi file, ở post man là phần form-data ở body
            Authorization: `Bearer ${accessToken}`, //đoạn này là gửi token từ client lên server này
          },
        }
      );
      setOpenSettingModel(false);
      console.log("Response: ", response.data);
      alert("Update successful!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Update Failed!");
    }
  };
  //Kết nối Api điều chỉnh artist page của cá nhân
  const handleArtistChange = async () => {
    const formData = new FormData();
    formData.append("artistName", artistName);
    formData.append("artistDescribe", artistDescribe);
    if (artistBackgroundImg) {
      formData.append("backGroundImg", artistBackgroundImg); // Phải khớp key trong backend
    }
    if (artistImg) {
      formData.append("artistImg", artistImg); // Phải khớp key trong backend
    }
    try {
      const response = await axios.put(
        "http://localhost:8081/api/v1/artist/detail/updated",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Artist Page Updated Successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating artist page:", error.message);
      alert("Update Failed!");
    }
  };
  //Kết nối api lấy artist qua userId

  //Kết nối với Api lấy thông tin chi tiết người dùng
  //Dùng useEffect để thông tin được đẩy lên mỗi khi thay đổi
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/v1/user/details",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const userData = response.data.data;
        setSettingName(userData.userName || "");
        setSettingAge(userData.age || "");
        setSettingPhoneNumber(userData.phoneNumber || "");
        setAvaImg(userData.avatarImg || null);
        setRole(userData.role || "user");
        const artistResponse = await axios.get(
          `http://localhost:8081/api/v1/artist/detail/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const artist = artistResponse.data.data;
        setArtistInfor(artist);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        // alert("Failed to fetch user details");
      }
    };
    fetchUserData();
  }, [accessToken]);

  return (
    <div className="ProfileUserPage">
      <div className="ProfileFrame">
        <div className="profileHeaderFrame">
          <div className="avaFrame">
            {avaImg ? (
              <img src={avaImg} alt="" />
            ) : (
              <div className="setAvaFrame">
                <User2></User2>
              </div>
            )}
          </div>
          <div className="title">
            <div className="role">Profile</div>
            <div className="userName">{settingName}</div>
          </div>
        </div>
        <div className="actionFrame">
          <div className="actionFrameLeft">
            <div className="checkMore" onClick={OnOpenMenuSettingModel}>
              ...
            </div>
            {openMenuSettingModel && (
              <div className="checkMoreFrame">
                <div className="EditBtn row" onClick={OnOpenSettingModel}>
                  <EditIcon2 width={"30px"} height={"30px"}></EditIcon2>
                  <div className="title">Edit profile</div>
                </div>
                <div className="CopyLinkBtn row">
                  <CopyIcon></CopyIcon>
                  <div className="title">Copy link to profile</div>
                </div>
              </div>
            )}
            {openSettingModel && (
              <div className="SettingModel">
                <div className="SettingModelFrame">
                  <div className="ModelHeading">
                    <div className="title">Profile details</div>
                    <div
                      className="btnCloseMd"
                      onClick={() => {
                        setOpenSettingModel(false);
                      }}
                    >
                      X
                    </div>
                  </div>
                  <div className="changeSettingFrame">
                    <div className="ChangeAvaframe">
                      <div
                        className="changeAva custom-upload"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        Choose Photo
                      </div>
                      <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }} // Ẩn input file
                        onChange={(e) => setSelectedFile(e.target.files[0])} // Xử lý khi chọn file
                      />
                      <EditIcon2 width={"50px"} height={"50px"}></EditIcon2>
                      <div className="RemoveAva">Remove Photo</div>
                    </div>
                    <div className="changeMoreDetails">
                      <input
                        type="text"
                        className="detailsFrame changeName"
                        placeholder="Name"
                        value={settingName}
                        onChange={(e) => setSettingName(e.target.value)}
                      />
                      <input
                        value={settingPhoneNumber}
                        onChange={(e) => setSettingPhoneNumber(e.target.value)}
                        type="text"
                        className="detailsFrame changePhoneNumber"
                        placeholder="Phone number"
                      />
                      <input
                        type="text"
                        className="detailsFrame changeName"
                        placeholder="Age"
                        value={settingAge}
                        onChange={(e) => setSettingAge(e.target.value)}
                      />
                      <button className="btnSave" onClick={handleSave}>
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="ModelBottom">
                    <p>
                      By proceeding, you agree to give Spotify access to the
                      image you choose to upload.
                    </p>
                    <p>
                      {" "}
                      Please make sure you have the right to upload the image.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="actionFrameRight">
            {role === "artist" && (
              <div
                className="viewArtistPage-btn"
                onClick={() => nav(`/artist/${artistInfo._id}`)}
              >
                View Your Page
              </div>
            )}
          </div>
        </div>
        {role === "artist" && (
          <div className="UploadSong">
            <div className="title">
              <h2>
                Upload your <span className="">songs</span>
              </h2>
            </div>
            <UploadSongFrame></UploadSongFrame>
            {/* component cho gửi audio, ảnh, tên bài hát */}
          </div>
        )}
        {role === "artist" && (
          <div className="artistNavigation">
            <div className="title">
              <h2>
                Edit your artist <span className="">page</span>
              </h2>
            </div>
            <div className="EditMyArtistPage">
              <div className="frame">
                <label className="title">Your Artist Name</label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Enter your artist name"
                />
              </div>
              <div className="frame">
                <label for="artistBackground" className="title">
                  Your Artist Background'Img
                </label>
                <input
                  type="file"
                  id="artistBackground"
                  onChange={(e) => setArtistBackgroundImg(e.target.files[0])}
                />
              </div>
              <div className="frame">
                <label className="title">Some describe of you</label>
                <input
                  type="text"
                  value={artistDescribe}
                  onChange={(e) => setArtistDescribe(e.target.value)}
                  placeholder="Describe yourself"
                />
              </div>
              <div className="frame">
                <label className="title">Your Artist Img</label>
                <input
                  type="file"
                  onChange={(e) => setArtistImg(e.target.files[0])}
                />
              </div>
              <button className="btnSave" onClick={handleArtistChange}>
                Save
              </button>
            </div>
          </div>
        )}
        {role === "artist" && (
          <div
            className="manageYourSong"
            onClick={() => nav(`/artistManage/${artistInfo._id}`)}
          >
            See your all songs
          </div>
        )}
      </div>
      {role === "artist" ? (
        <CatComponent></CatComponent>
      ) : (
        <div className="BecomeArtistFrame JoinUs-frame">
          <h2>Thank for listening. Upload your first song?</h2>
          <div className="title2">
            Upload song and build album. All for free.
          </div>
          <button
            className="becomeArtist-btn2 sign-up-btn2"
            onClick={() => nav("/become-artist")}
          >
            Become artist
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileUserPage;

//Mỗi user sẽ có 1 artist page riêng, và page đó có thể cho user khác nhìn thấy
