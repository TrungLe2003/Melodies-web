import "./styles2.css";
import { useNavigate } from "react-router-dom";
const ArtistFrame1 = ({ songData }) => {
  const toArtistPage = () => {
    nav(`/artist/${songData.idArtist._id}`);
  };
  const nav = useNavigate();
  return (
    <div className="ArtistFrame1" onClick={toArtistPage}>
      <img src={songData.idArtist.artistImg} alt="" />
      <div className="content">
        <div className="title">Artist</div>
        <div className="nameArtist">{songData.idArtist.artistName}</div>
      </div>
    </div>
  );
};

export default ArtistFrame1;
