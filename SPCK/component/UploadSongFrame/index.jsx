import "./style.css";
//
import { useState } from "react";
import axios from "axios";
//
const UploadSongFrame = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [songName, setSongName] = useState("");
  const [songImg, setSongImg] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState(""); // Để hiển thị thông báo
  const handleUpload = async () => {
    if (!songName || !songImg || !audioFile) {
      setMessage("Song need all information"); //cần ktra xem đủ thông tin không
      return;
    }
    const formDataUpload = new FormData();
    formDataUpload.append("songName", songName);
    formDataUpload.append("songImg", songImg);
    formDataUpload.append("audioFile", audioFile);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/song/uploadSong",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data", //này giống với phần upload body -> form-data bên post man (gửi nhiều phần định dạng format)
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        //cái này để biết là có tải thành công không
        setMessage("Song uploaded successfully!");
      } else {
        setMessage(`Error: ${response.data.message}`); //lấy lỗi ở status(500)
      }
    } catch (error) {
      console.error("Error uploading song:", error.message);
      setMessage("An error occurred while uploading the song.");
    }
  };

  return (
    <div className="uploadForm">
      {message && <p>{message}</p>} {/* Hiển thị thông báo */}
      <div className="frame">
        <label htmlFor="Your new song's name">Your new song's name</label>
        <input
          type="text"
          placeholder="Song Name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
      </div>
      <div className="frame">
        <label htmlFor="Your new song's img">Your new song's img</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSongImg(e.target.files[0])}
        />
      </div>
      <div className="frame">
        <label htmlFor="Your new song's audio">Your new song's audio</label>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
        />
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadSongFrame;
