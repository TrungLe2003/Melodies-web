import MusicDisk from "../../src/assets/musicDisk";
import MusicLogo from "../../src/assets/music-svgrepo-com";
import { useNavigate } from "react-router-dom";

import "./style2.css";

const MusicFrame2 = ({ song }) => {
  const nav = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const toMusicPage = () => {
    if (!accessToken) {
      alert("You must sign in to access this page.");
      return;
    }
    nav(`/song/${song._id}`);
  };
  return (
    <div className="music2-frame" onClick={toMusicPage}>
      <img src={song.songImg} alt="" />
      <div className="title">
        <div className="mf2-nameSong-author">
          <div className="nameSong">{song.songName}</div>
          {/* <div className="author">-{song.idArtist.artistName}-</div> */}
        </div>
        <MusicLogo></MusicLogo>
      </div>
    </div>
  );
};

export default MusicFrame2;
