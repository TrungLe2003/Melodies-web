import "./style.css";
//
import { useAudio } from "../../src/context/AudioContext";
//
import VerifyIcon from "../../src/assets/VerifyIcon";
import PlayBtnIcon from "../../src/assets/BtnPlayIcon";
//
import MusicFrame3 from "../music-frame/MusicFrame3";
import AlbumFrame2 from "../album/Albumframe2";
import Loading from "../Loading";
//
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ArtistPage = () => {
  const { setSongListContext } = useAudio();
  const [artistInfo, setArtistInfor] = useState(null);
  const [songs, setSongs] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  // if (accessToken) {
  //   console.error(" access token found", accessToken);

  // }
  const { artistId } = useParams();
  console.log("artistId:", artistId);
  useEffect(() => {
    //Cho vào trong hàm để await async dữ liệu
    const fetchArtistData = async () => {
      try {
        const artistResponse = await axios.get(
          `http://localhost:8081/api/v1/artist?artistId=${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const artist = artistResponse.data.data; //bởi vì response trả về là { data: {...}}
        setArtistInfor(artist);

        //lấy dữ liệu bài hát cả artist
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
        setSongListContext(songsData);
      } catch (error) {
        console.error("Error fetching artist or songs:", error.message);
        if (error.response) {
          console.error("API Error:", error.response.data.message);
        } else {
          console.error("Error:", error.message);
        }
      }
    };
    fetchArtistData();
  }, [accessToken, artistId]);
  if (!artistInfo) {
    return <Loading></Loading>;
  }
  return (
    <div className="ArtistPage">
      <div className="artistFrame">
        <div className="artistHeaderFrame">
          <div className="backgroundImg">
            <img src={artistInfo.backGroundImg} alt="" />
          </div>
          <div className="someArtistInfromation">
            <div className="verifyArtist">
              <VerifyIcon></VerifyIcon>
              <div>Verified Artist</div>
            </div>
            <div className="nameArtist">{artistInfo.artistName}</div>
            <div className="countListeners">104,958,570 monthly listeners</div>
          </div>
        </div>
        <div className="actionFrame">
          <div className="actionFrameLeft">
            <div className="btnPlay">
              <PlayBtnIcon
                style={{ width: "30px", height: "30px" }}
              ></PlayBtnIcon>
            </div>
            <div className="btnFollowArtist">Follow</div>
            <div className="checkMore">...</div>
          </div>
        </div>
        <div className="popularTrack">
          <div className="title">
            <h2>Popular</h2>
          </div>
          <div className="popularTrackSongList">
            {songs &&
              songs.map((song, index) => (
                <div className="musicFrame" key={song._id}>
                  <div className="musicCount">{index + 1})</div>
                  <MusicFrame3 song={song} artistInfo={artistInfo} />
                </div>
              ))}
          </div>
        </div>
        {/* <div className="popularAlbum">
          <h2>Artist Album</h2>
          <div className="popularAlbumList">
            <AlbumFrame2></AlbumFrame2>
            <AlbumFrame2></AlbumFrame2>
            <AlbumFrame2></AlbumFrame2>
          </div>
        </div> */}
        <div className="AboutArtist">
          <h2>About</h2>
          <div className="someArtistInfromation2">
            <p className="someDes">{artistInfo.artistDescribe}</p>
          </div>
          <div className="AboutArtistImg">
            <img src={artistInfo.artistImg} alt="" />
          </div>
        </div>
        <div className="artistFrameBottom">2024 Melodies</div>
      </div>
    </div>
  );
};

export default ArtistPage;
