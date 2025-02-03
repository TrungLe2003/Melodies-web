import "./styles.css";
//
import PlayBtnIcon from "../../src/assets/BtnPlayIcon";
import ListIcon from "../../src/assets/listIcon";
import ClockIcon from "../../src/assets/ClockIcon";
import MusicFrame from "../music-frame/MusicFrame";
import Album1 from "../album/Album1";
import Loading from "../Loading";
//
import { formatTime } from "../AudioPlayerBar";
//
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AlbumPage = () => {
  const { albumId } = useParams();
  const accessToken = localStorage.getItem("accessToken");
  const [crrAlbum, setCrrAlbum] = useState(null); //lấy thông tin album hiện tại
  const [songFromAlbum, setSongFromAlbum] = useState(null);
  const [artistAlbum, setArtistAlbum] = useState(null); //lấy album của tác giả
  const nav = useNavigate();

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/album?albumId=${albumId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCrrAlbum(response.data.data);
        // Đợi có albumData và idArtist có dữ liệu
        if (response.data.data && response.data.data.idArtist) {
          //Lấy bài hát của album
          const albumSongResponse = await axios.get(
            `http://localhost:8081/api/v1/song/getAlbumSong?albumId=${albumId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const songsData = albumSongResponse.data.data;
          setSongFromAlbum(songsData);
          //lấy album của artist
          const responseArtistAlbum = await axios.get(
            `http://localhost:8081/api/v1/album/getAlbums?artistId=${response.data.data.idArtist._id}&limit=5`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const artistAlbumData = responseArtistAlbum.data.data;
          setArtistAlbum(artistAlbumData);
        } else {
          console.error("No artist data available for this song.");
        }
      } catch (error) {
        console.error("Error fetching song data:", error.message);
      }
    };
    fetchAlbumData();
  }, [albumId]);
  if (!crrAlbum) {
    return <Loading></Loading>;
  }
  return (
    <div className="albumPage">
      <div className="albumFrame">
        <div className="albumHeaderFrame">
          <div className="albumImg">
            <img src={crrAlbum.albumImg} alt="" />
          </div>
          <div className="someAlbumInfromation">
            <div className="nameCate">#Albums</div>
            <div className="AlbumsName">{crrAlbum.albumName}</div>
            <div className="authorInforCount">
              <div className="authorInfor">
                <img src={crrAlbum.idArtist.artistImg} alt="" />
                <div
                  className="authorName"
                  onClick={() => nav(`/artist/${crrAlbum.idArtist._id}`)}
                >
                  {crrAlbum.idArtist.artistName}
                </div>
              </div>
              <div className="countSong">
                - {songFromAlbum ? songFromAlbum.length : 0} Songs -
              </div>
              <div className="countTime">2024 album</div>
            </div>
          </div>
        </div>
        <div className="actionFrame">
          <div className="actionFrameLeft">
            <div className="btnPlay">
              <PlayBtnIcon
                style={{ width: "30px", height: "30px" }}
              ></PlayBtnIcon>
            </div>

            <div className="btnAddToPlaylist">+</div>
            <div className="checkMore">...</div>
          </div>
          <div className="actionFrameRight">
            <div>List</div>
            <ListIcon></ListIcon>
          </div>
        </div>
        <div className="albumListFrame">
          <div className="noteFrame">
            <div className="#title"># Title</div>
            <ClockIcon></ClockIcon>
          </div>
          <div className="line"></div>

          {songFromAlbum && songFromAlbum.length > 0 ? (
            songFromAlbum.map((song, index) => (
              <div className="musicFrame" key={song._id}>
                <div className="musicCount">{index + 1}</div>
                <MusicFrame song={song} />
              </div>
            ))
          ) : (
            <div>This album does not have songs yet.</div>
          )}
        </div>
        <div className="releaseTime">October 16, 2024</div>
        <div className="moreArtistsAlbum">
          <h2>
            More By <span className="">{crrAlbum.idArtist.artistName}</span>
          </h2>
          <div className="moreArtistsAlbumList">
            {artistAlbum && artistAlbum.length > 0 ? (
              artistAlbum.map((album, index) => (
                <div className="item" key={album._id}>
                  <Album1 album={album}></Album1>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="albumFrameBottom">2024 Melodies</div>
      </div>
    </div>
  );
};

export default AlbumPage;
