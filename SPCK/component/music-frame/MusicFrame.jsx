import "./style.css";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../AudioPlayerBar";

const MusicFrame = ({ song }) => {
  const nav = useNavigate();

  return (
    <div className="music" onClick={() => nav(`/song/${song._id}`)}>
      <div className="music-name-image">
        <img src={song.songImg} alt="" />
        <div className="nameSong-author">
          <div className="nameSong">{song.songName}</div>
          <div className="author">-{song.idArtist.artistName}-</div>
        </div>
      </div>
      <div className="release-date">4 months ago</div>
      <div className="album-name">
        {song.idAlbum?.albumName || "Not in album"}
      </div>
      <div className="time">{formatTime(song.duration)}</div>
    </div>
  );
};

export default MusicFrame;
