import "./style.css";
import { useNavigate } from "react-router-dom";

const Album1 = ({ album }) => {
  const nav = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  return (
    <div
      className="album1"
      onClick={() => {
        if (!accessToken) {
          alert("You must sign in to access this page.");
          return;
        }
        nav(`/album/${album._id}`);
      }}
    >
      <img src={album.albumImg} alt="" />
      <div className="nameAlbum-author">
        <div className="nameAlbum">{album.albumName}</div>
        <div className="author">-{album.idArtist.artistName}-</div>
      </div>
    </div>
  );
};

export default Album1;
