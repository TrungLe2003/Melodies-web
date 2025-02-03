import "./style.css";
//
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const ArtistManageAlbumPage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [albums, setAlbums] = useState([]); //lấy dữ liệu albums
  const [songs, setSongs] = useState([]); //lấy dữ liệu bài hát (để add vô album)
  const [albumName, setAlbumName] = useState(""); // để thêm albums
  const [albumImg, setAlbumImg] = useState(null);
  const [message, setMessage] = useState(""); // Để hiển thị thông báo
  const [openAddAlbumModel, setOpenAddAlbumModel] = useState(false);
  //cho api thêm bài hát
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedSongName, setSelectedSongName] = useState(null);
  const nav = useNavigate();
  const { artistId } = useParams();

  const decoded = jwt_decode(accessToken);
  const role = decoded.role;
  console.log(role);

  // if (role !== "artist") {
  //   alert("You are not an artist!");
  //   return;
  // }

  const onOpenAddAlbumModel = () => {
    if (openAddAlbumModel) {
      setOpenAddAlbumModel(false);
    } else {
      setOpenAddAlbumModel(true);
    }
  };
  //Api tạo album

  const handleUpload = async () => {
    if (!albumName || !albumImg) {
      setMessage("Please provide both album name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("albumName", albumName);
    formData.append("file", albumImg);

    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/album/createAlbum/${artistId}`, // Thay `artistId` bằng giá trị phù hợp
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Album created successfully!");
        setAlbumName("");
        setAlbumImg(null);
        fetchAlbums(); // Cập nhật danh sách album sau khi tạo
      } else {
        setMessage(response.data.message || "Failed to create album.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error occurred while uploading."
      );
      console.error(error);
    }
  };

  //Kết nối Api lấy album bằng artist id
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/album/getAlbums?artistId=${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data.data;
      setAlbums(data);

      const songResponse = await axios.get(
        `http://localhost:8081/api/v1/song/getSong?artistId=${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const songsData = songResponse.data.data;
      setSongs(songsData);
    } catch (error) {
      setMessage("Error occurred while fetching albums.");
      console.error(error);
    }
  };

  //Api thêm bài hát vào albums
  const handleAddSongToAlbum = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/v1/album/${selectedAlbumId}?songIdAdded=${selectedSongId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Add song to album successful!");
        setSelectedAlbumId(null);
        setSelectedSongId(null);
        setSelectedSongName(null);
        fetchAlbums(); // Cập nhật danh sách album sau khi tạo
      } else {
        setMessage(response.data.message || "Failed to create album.");
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };
  if (!albums) {
    return <div>Loading...</div>;
  }

  if (songs.length === 0 && selectedAlbumId) {
    return <div>No songs available to add.</div>;
  }

  // Gọi API khi component được render
  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="ArtistManageAlbumPage">
      <h2 className="ArtistName">Your Albums</h2>
      <div className="line"></div>
      <div className="albumList">
        {albums.map((album, index) => (
          <div className="frame" key={album._id}>
            <div className="count">{index + 1})</div>
            <div className="albumFrame">
              <img src={album.albumImg} alt={`${album.albumName}`} />
              <div
                className="albumName"
                onClick={() => nav(`/album/${album._id}`)}
              >
                {album.albumName}
              </div>
              <div>{new Date(album.createdAt).getFullYear()} album</div>
              {/*  */}
              {selectedAlbumId && (
                <div className="addSongtoAlbumFrame">
                  <div
                    className="onCloseAddSongtoAlbumFrame"
                    onClick={() => {
                      setSelectedAlbumId(null), setSelectedSongName(null);
                    }}
                  >
                    X
                  </div>
                  <div className="songList">
                    {songs &&
                      songs.map((song, index) => (
                        <div
                          className="songFrame"
                          key={song._id}
                          onClick={() => {
                            setSelectedSongName(song.songName),
                              setSelectedSongId(song._id);
                          }}
                        >
                          <img src={song.songImg} alt="" />
                          <div className="nameSong">{song.songName}</div>
                        </div>
                      ))}
                  </div>
                  <div className="actionAddToAlbum">
                    <button className="BtnAdd" onClick={handleAddSongToAlbum}>
                      Add
                    </button>
                    <div className="choosenSong">
                      {selectedSongName || `Song`}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="actionFrame">
              <div
                className="AddSongBtn btn"
                onClick={() => setSelectedAlbumId(album._id)}
              >
                Add song
              </div>
              <div className="deleteAlbum btn">X</div>
            </div>
          </div>
        ))}
      </div>
      <div className="AddmoreAlbum">
        <div className="btnAdd" onClick={onOpenAddAlbumModel}>
          +
        </div>
        {openAddAlbumModel && (
          <div className="uploadForm">
            {message && <p>{message}</p>}
            <div className="frame">
              <label htmlFor="Your new Album's name">
                Your new Album's name
              </label>
              <input
                type="text"
                placeholder="Album Name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
              />
            </div>
            <div className="frame">
              <label htmlFor="Your new Album's img">Your new Album's img</label>

              <input
                type="file"
                onChange={(e) => setAlbumImg(e.target.files[0])}
              />
            </div>
            <button onClick={handleUpload}>Upload</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistManageAlbumPage;
