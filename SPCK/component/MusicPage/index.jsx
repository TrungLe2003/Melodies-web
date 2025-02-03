import "./style.css";
//
import PlayBtnIcon from "../../src/assets/BtnPlayIcon";
import MusicFrame from "../music-frame/MusicFrame";
import AlbumFrame2 from "../album/Albumframe2";
import ArtistFrame1 from "../artist/ArtistFrame1";
import ArtistRecommend from "../artist/Artist-recomend";
import MusicFrame3 from "../music-frame/MusicFrame3";
import Loading from "../Loading";
//hàm từ code khác
import { formatTime } from "../AudioPlayerBar";

//
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAudio } from "../../src/context/AudioContext";
import axios from "axios";
//
const SongPage = () => {
  const nav = useNavigate();
  //Kết nối Api lấy dữ liệu bài hát bằng id
  const { songId } = useParams();
  const { currentSong, isPlaying, playSong, pauseSong } = useAudio();
  const [songData, setSongData] = useState(null);
  const [artistSong, setArtistSong] = useState(null); //lấy bài hát của artist
  const [artistAlbum, setArtistAlbum] = useState(null); //lấy album của tác giả
  const [albumSong, setAlbumSong] = useState(null); //để render album mà bài hát nằm trong
  const [moreArtist, setMoreArtist] = useState(null); //các artist khác
  const accessToken = localStorage.getItem("accessToken");
  const [artistInfo, setArtistInfo] = useState(null); //ttin của tác giả bài hát
  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/song?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSongData(response.data.data);
        // Đợi songData và idArtist có dữ liệu rồi mới truy cập
        if (response.data.data && response.data.data.idArtist) {
          setArtistInfo(response.data.data.idArtist);
          const songResponse = await axios.get(
            `http://localhost:8081/api/v1/song/getSong?artistId=${response.data.data.idArtist._id}&limit=6`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const artistSongsData = songResponse.data.data;
          setArtistSong(
            artistSongsData.filter(
              (song) => song._id !== response.data.data._id
            ) // Bỏ bài hiện tại
          );
          //Lấy album của artist
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
          //
          const moreArtistResponse = await axios.get(
            "http://localhost:8081/api/v1/artist/allArtist?limit=5"
          );
          const moreArtistData = moreArtistResponse.data.data;
          setMoreArtist(
            moreArtistData.filter(
              (artist) => artist._id !== response.data.data.idArtist._id //artist cuar bafi hein tai
            )
          );
          // setMoreArtist(moreArtistData);
        } else {
          console.error("No artist data available for this song.");
        }
      } catch (error) {
        console.error("Error fetching song data:", error.message);
      }
    };
    fetchSongData();
  }, [songId]);

  if (!songData) {
    return <Loading></Loading>;
  }
  const handlePlayPause = () => {
    if (currentSong?.audioURL === songData.audioURL) {
      isPlaying ? pauseSong() : playSong(songData);
    } else {
      playSong(songData);
    }
  };
  if (!artistSong && songData) {
    return <Loading></Loading>;
  }
  return (
    <div className="SongPage">
      <div className="albumFrame">
        <div className="albumHeaderFrame">
          <div className="albumImg">
            <img src={songData.songImg} alt="" />
          </div>
          <div className="someAlbumInfromation">
            <div className="nameCate">Song</div>
            <div className="AlbumsName">{songData.songName}</div>
            <div className="authorInforCount">
              <div className="authorInfor">
                <img src={songData.idArtist.artistImg} alt="" />
                <div
                  className="authorName"
                  onClick={() => nav(`/artist/${songData.idArtist._id}`)}
                >
                  {songData.idArtist.artistName}
                </div>
              </div>
              <div
                className="fromAlbum"
                onClick={() => nav(`/album/${songData.idAlbum._id}`)}
              >
                - {songData.idAlbum?.albumName || "Not in album"} -
                {/* phải có cú pháp ?. nếu k có thì là null -< || mới hoạt động */}
              </div>
              <div className="countTime">{formatTime(songData.duration)}</div>
            </div>
          </div>
        </div>
        <div className="actionFrame">
          <div className="actionFrameLeft">
            <div className="btnPlay" onClick={handlePlayPause}>
              {currentSong?.audioURL === songData.audioURL && isPlaying ? (
                "||"
              ) : (
                <PlayBtnIcon
                  style={{ width: "30px", height: "30px" }}
                ></PlayBtnIcon>
              )}
            </div>
            <div className="btnAddToPlaylist">+</div>
            <div className="checkMore">...</div>
          </div>
        </div>
        <div className="artistFrame">
          <ArtistFrame1 songData={songData}></ArtistFrame1>
        </div>

        <div className="popularAlbum">
          <h2>Popular Albums by {songData.idArtist.artistName}</h2>
          <div className="popularAlbumList">
            {artistAlbum && artistAlbum.length > 0 ? (
              artistAlbum.map((album, index) => {
                return (
                  <div key={album._id}>
                    <AlbumFrame2 album={album}></AlbumFrame2>
                  </div>
                );
              })
            ) : (
              <div>This artist does not have any albums yet</div>
            )}
          </div>
        </div>
        <div className="popularTrack">
          <div className="title">
            <div>Popular Tracks by </div>
            <h2>{songData.idArtist.artistName}</h2>
          </div>
          <div className="popularTrackSongList">
            {artistSong && artistSong.length > 0 ? (
              artistSong.map((song, index) => {
                return (
                  <div className="musicFrame" key={song._id}>
                    <div className="musicCount">{index + 1}</div>
                    <MusicFrame3 song={song} artistInfo={artistInfo} />
                  </div>
                );
              })
            ) : (
              <div>No songs found for this artist.</div> // Thông báo khi không có bài hát
            )}
          </div>
        </div>
        <div className="fanAlsoLike">
          <div className="title">
            <h2>Fans Also Like</h2>
          </div>
          <div className="fanAlsoLikeList">
            {moreArtist && moreArtist.length > 0 ? (
              moreArtist.map((artist) => (
                <div className="item" key={artist._id}>
                  <ArtistRecommend artist={artist} />
                </div>
              ))
            ) : (
              <div>No related artists found.</div>
            )}
          </div>
        </div>
        {/* <div className="albumListFrame">
          <div className="fromTheAlbumFrame">
            <img src="./public/album/album1.png" alt="" />
            <div className="title">
              <div className="fromAlbum">From the album</div>
              <div className="nameAlbum">HIT ME HARD AND SOFT</div>
            </div>
          </div>

          <div className="musicFrame">
            <div className="musicCount">1</div>
            <MusicFrame></MusicFrame>
          </div>
          <div className="musicFrame">
            <div className="musicCount">1</div>
            <MusicFrame></MusicFrame>
          </div>
          <div className="musicFrame">
            <div className="musicCount">1</div>
            <MusicFrame></MusicFrame>
          </div>
          <div className="musicFrame">
            <div className="musicCount">1</div>
            <MusicFrame></MusicFrame>
          </div>
          <div className="musicFrame">
            <div className="musicCount">1</div>
            <MusicFrame></MusicFrame>
          </div>
        </div> */}
        <div className="albumFrameBottom">2024 Melodies</div>
      </div>
    </div>
  );
};

export default SongPage;
