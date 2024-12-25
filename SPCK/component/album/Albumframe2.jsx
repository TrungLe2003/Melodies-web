import "./style2.css";
import { useNavigate } from "react-router-dom";

const AlbumFrame2 = ({ album }) => {
  const nav = useNavigate();

  return (
    <div
      className="albumframe2"
      onClick={() => {
        nav(`/album/${album._id}`);
      }}
    >
      <img src={album.albumImg} alt="" />
      <div className="nameAlbum-release">
        <div className="nameAlbum">{album.albumName}</div>
        <div className="release"> 2024 - album</div>
      </div>
    </div>
  );
};

export default AlbumFrame2;
