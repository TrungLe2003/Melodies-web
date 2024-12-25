import ArtistRecommend from "../artist/Artist-recomend";
import Album1 from "../album/Album1";
//Lấy hàm tính tgian
import { formatTime } from "../AudioPlayerBar";
//
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
//
import "./style.css";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");
  const nav = useNavigate();
  const [songsFound, setSongsFound] = useState(null);
  const [artistsFound, setArtistsFound] = useState(null);
  const [albumsFound, setAlbumsFound] = useState(null);
  const [topResults, setTopResults] = useState(null);
  const accessToken = localStorage.getItem("accessToken") || null;

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
    console.log(searchQuery);
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data;
      console.log(data);

      setSongsFound(data.songs);
      setArtistsFound(data.artists);
      setAlbumsFound(data.albums);
      setTopResults(data.topResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="searchP">
      <div className="TopResult">
        <h2>
          Top song <span className="">result</span>
        </h2>
        <div className="topResultList">
          {topResults && topResults.length > 0 ? (
            topResults.map((song, index) => {
              return (
                <div
                  className="topResultFrame"
                  key={index}
                  onClick={() => nav(`/song/${song._id}`)}
                >
                  <img src={song.songImg} alt="" />
                  <div className="topResultInfo">
                    <div className="cate">Song</div>
                    <div className="songName">{song.songName}</div>
                    <div className="artistName">
                      - {song.idArtist.artistName} -
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>No song found</>
          )}
        </div>
      </div>
      <div className="songFoundFrame">
        <h2>Song</h2>
        <div className="songFoundList">
          {songsFound && songsFound.length > 0 ? (
            songsFound.map((song, index) => {
              return (
                <div
                  className="songFound"
                  key={index}
                  onClick={() => nav(`/song/${song._id}`)}
                >
                  <div className="songFoundFrameLeft">
                    <img src={song.songImg} alt="" />
                    <div className="songFoundInfo">
                      <div className="songName">{song.songName}</div>
                      <div className="artistName">
                        - {song.idArtist.artistName} -
                      </div>
                    </div>
                  </div>
                  <div className="time">{formatTime(song.duration)}</div>
                </div>
              );
            })
          ) : (
            <>No song Found</>
          )}
        </div>
      </div>
      <div className="albumFound">
        <h2>Album</h2>
        <div className="albumFoundList">
          {albumsFound && albumsFound.length > 0 ? (
            albumsFound.map((album, index) => {
              return (
                <div className="item" key={index}>
                  <Album1 album={album}></Album1>
                </div>
              );
            })
          ) : (
            <>No album Found</>
          )}
        </div>
      </div>
      <div className="albumFound">
        <h2>Album</h2>
        <div className="albumFoundList">
          {artistsFound && artistsFound.length > 0 ? (
            artistsFound.map((artist, index) => {
              return (
                <div className="item" key={index}>
                  <ArtistRecommend artist={artist}></ArtistRecommend>
                </div>
              );
            })
          ) : (
            <>No artist Found</>
          )}
        </div>
      </div>
      <div className="someCategory">
        <h2>
          Maybe you <span className="">like</span>
        </h2>
        <div className="listCategory">
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
          <div className="item">
            <div className="nameCategory">Music</div>
            <img src="..//../public/autoscrolling/InVain.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
