import "./style1.css";
//
import { useNavigate } from "react-router-dom";

const ArtistRecommend = ({ artist }) => {
  const nav = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const toArtistPage = () => {
    if (!accessToken) {
      alert("You must sign in to access this page.");
      return;
    }
    nav(`/artist/${artist._id}`);
  };
  return (
    <div className="artist1" onClick={toArtistPage}>
      <img src={artist.artistImg} alt="" />
      <div className="content">{artist.artistName}</div>
    </div>
  );
};

export default ArtistRecommend;
