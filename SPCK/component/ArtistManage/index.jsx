import "./style.css";
//
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
//
import AlbumManageIcon from "../../src/assets/AlbumIcon";
import ManageSongIcon from "../../src/assets/SongIcon";

//
const ArtistManagePage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const nav = useNavigate();
  const { artistId } = useParams();
  return (
    <div className="ArtistManagePage">
      <div className="menuFrame">
        <div className="frame" onClick={() => nav(`/artistManage/${artistId}`)}>
          <ManageSongIcon></ManageSongIcon>
          <div className="title">Your Musics</div>
        </div>
        <div
          className="frame"
          onClick={() => nav(`/artistManage/${artistId}/manageAlbums`)}
        >
          <AlbumManageIcon></AlbumManageIcon>
          <div className="title">Your Albums</div>
        </div>
      </div>
      <div className="rightFrame">
        <div className="header">
          <div className="title">
            <div className="logo" onClick={() => nav("/")}>
              Melodies
            </div>
          </div>
        </div>
        <div className="content">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default ArtistManagePage;
