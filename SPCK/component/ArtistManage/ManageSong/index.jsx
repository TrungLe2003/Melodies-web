import "./style.css";
//
import MusicFrame from "../../music-frame/MusicFrame";
import EditIcon2 from "../../../src/assets/EditIcon2";
//
import UploadSongFrame from "../../UploadSongFrame";
//
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ArtistManageSongPage = () => {
  const [selectedDeleteSongId, setSelectedDeleteSongId] = useState(null); // ID bài hát đang mở DeleteFrame
  const [selectedEditSongId, setSelectedEditSongId] = useState(false); // Id bài hát đang mở edit frame
  const [openUploadSongFrame, setOpenUploadSongFrame] = useState(false); // Thêm bài hát
  const [songs, setSongs] = useState(null);
  const [selectedImgSongFile, setSelectedImgSongFile] = useState(null);
  const [selectedSongName, setSelectedSongName] = useState(null);
  const { artistId } = useParams();
  const accessToken = localStorage.getItem("accessToken");
  const nav = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const songResponse = await axios.get(
          `http://localhost:8080/api/v1/song/getSong?artistId=${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const songsData = songResponse.data.data;
        if (songsData) {
          setSongs(songsData);
        }
      } catch (error) {
        if (error.response) {
          console.error("API Error:", error.response.data.message);
        } else {
          console.error("Error:", error.message);
        }
      }
    };
    fetchData();
  }, [accessToken, artistId]);

  // API xóa bài hát
  const deletedSong = async (songId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/song/deletedSong/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data.message);

      // Cập nhật danh sách bài hát sau khi xóa thành công (loại bỏ bài có id cũ)
      setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId));
      setSelectedDeleteSongId(null);
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  //api edit song
  const editSong = async (songId) => {
    const formData = new FormData();
    if (selectedSongName) {
      formData.append("songName", selectedSongName);
    }
    if (selectedImgSongFile) {
      formData.append("file", selectedImgSongFile); // Tên này phải trùng với key ở phía server
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/song/changeDetails/${songId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data.message);
      alert("Updated successful!");

      // Cập nhật bài hát trong danh sách sau khi chỉnh sửa
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song._id === songId ? { ...song, ...response.data.data } : song
        )
      );

      // setSelectedEditSongId(null);
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  // Mở modal thêm nhạc
  const onOpenUploadSongFrame = () => {
    setOpenUploadSongFrame(!openUploadSongFrame);
  };

  return (
    <div className="ArtistManageSongPage">
      <h2 className="ArtistName">Your Songs</h2>
      <div className="line"></div>
      <div className="songList">
        {songs && songs.length > 0 ? (
          songs.map((song, index) => (
            <div className="frame" key={song._id}>
              <div className="count">{index + 1}</div>
              <div
                className="musicFrame"
                onClick={() => nav(`/song/${song._id}`)}
              >
                <MusicFrame song={song}></MusicFrame>
              </div>
              <div className="actionFrame">
                <div
                  className="editSong btn"
                  onClick={() => setSelectedEditSongId(song._id)}
                >
                  <EditIcon2 width={"30px"} height={"30px"}></EditIcon2>
                </div>
                {selectedEditSongId === song._id && (
                  <div className="EditMusicFrame">
                    <h2>Edit your music's name or image</h2>
                    <div
                      className="closeEditMusicFrame"
                      onClick={() => setSelectedEditSongId(null)}
                    >
                      X
                    </div>
                    <div className="frame2">
                      <div className="title">Change name</div>
                      <input
                        type="text"
                        value={selectedSongName || ""}
                        onChange={(e) => setSelectedSongName(e.target.value)}
                      />
                    </div>
                    <div className="frame2">
                      <div className="title">Change image</div>
                      <input
                        type="file"
                        onChange={(e) =>
                          setSelectedImgSongFile(e.target.files[0])
                        }
                      />
                    </div>
                    <div className="frameBtn">
                      <button onClick={() => editSong(song._id)}>Save</button>
                    </div>
                  </div>
                )}
                <div
                  className="deleteSong btn"
                  onClick={() => setSelectedDeleteSongId(song._id)}
                >
                  X
                </div>
                {selectedDeleteSongId === song._id && ( // Chỉ hiển thị DeleteFrame khi song._id trùng để tránh mở tất cả model
                  <div className="DeleteFrame">
                    <div className="ask">
                      Do you really want to delete this song?
                    </div>
                    <div className="title">
                      <div
                        className="acp choose"
                        onClick={() => deletedSong(song._id)}
                      >
                        Yes
                      </div>
                      /
                      <div
                        className="Rej choose"
                        onClick={() => setSelectedDeleteSongId(null)} // Đóng DeleteFrame
                      >
                        No
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="AddmoreSong">
        <div className="btnAdd" onClick={onOpenUploadSongFrame}>
          +
        </div>
        {openUploadSongFrame && <UploadSongFrame></UploadSongFrame>}
      </div>
    </div>
  );
};

export default ArtistManageSongPage;
