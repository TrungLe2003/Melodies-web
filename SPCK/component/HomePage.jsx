import MusicFrame from "./music-frame/MusicFrame";
import MusicFrame2 from "./music-frame/MusicFrame2";
import ArtistRecommend from "./artist/Artist-recomend";
import Album1 from "./album/Album1";
import CatComponent from "../src/assets/Cat";
//
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [someSong, setSomeSong] = useState(null); //hiển thị 1 số bài hát
  const [newestSong, setNewestSong] = useState(null); // lấy 7 bài hát mới nhất
  const [someArtist, setSomeArtist] = useState(null); //hiển thị 1 số artist
  const [someAlbum, setSomeAlbum] = useState(null); //hiển thị 1 số album
  const accessToken = localStorage.getItem("accessToken") || null;
  const decode = accessToken ? jwt_decode(accessToken) : null;
  const nav = useNavigate();

  useEffect(() => {
    const FetchData = async () => {
      try {
        // Lấy data album
        const responseAlbumData = await axios.get(
          "http://localhost:8081/api/v1/album/getAllAlbums?limit=5"
        );
        setSomeAlbum(responseAlbumData.data.data);

        // Lấy data artist
        const responseArtistData = await axios.get(
          "http://localhost:8081/api/v1/artist/allArtist?limit=5"
        );
        setSomeArtist(responseArtistData.data.data);

        // Lấy data song
        const responseSong = await axios.get(
          `http://localhost:8081/api/v1/song/getAllSongs?limit=6`
        );
        // console.log("API Response for songs:", responseSong.data);
        setSomeSong(responseSong.data.data);
        console.log(someSong);
        const responseNewestSong = await axios.get(
          `http://localhost:8081/api/v1/song/getNewestSongs?limit=7`
        );
        setNewestSong(responseNewestSong.data.data);
        console.log(newestSong);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    FetchData();
  }, []);
  // console.log("someSong after fetch:", someSong);
  return (
    <>
      {" "}
      <div className="MP-banner">
        <img src="./public/homepagebanner.png" alt="" />
        <div className="MP-banner-frame">
          <h2>Connect on Melodies</h2>
          <p>
            Discover, stream, and share a constantly expanding mix of music from
            emerging and major artists around the world.
          </p>
        </div>
        {/*  */}
      </div>
      <div className="MainPMusic-content">
        <h1>Hear what’s trending for free in the Melodies</h1>
        <div className="trending-music">
          <h2>
            New Music on <span className="">Melodies</span>
          </h2>
          <div
            className="frame-trendingMusic-auto-scrolling"
            style={{
              "--width": "200px",
              "--height": "200px",
              "--quantity": "7",
            }}
          >
            <div className="auto-scrolling-listMusic">
              {newestSong && newestSong.length > 0 ? (
                newestSong.map((song, index) => (
                  <div className="item" style={{ "--position": index + 1 }}>
                    <img src={song.songImg} alt="" />
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="trendingMusic-frame-listMusic">
            <div className="line"></div>
            <div className="musicTrending-frame-menu">
              <div>Song</div>
              <div>Release</div>
              <div>Album</div>
              <div>Time</div>
            </div>
            {newestSong && newestSong.length > 0 ? (
              newestSong.map((song, index) => (
                <MusicFrame song={song}></MusicFrame>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="newRelease-Music">
          <h2>
            Maybe you <span className="">Like</span>
          </h2>
          <div className="newRelease-Music-list">
            {someSong && someSong.length > 0 ? (
              someSong.map((song, index) => (
                <div className="item" key={song._id}>
                  <MusicFrame2 song={song}></MusicFrame2>
                </div>
              ))
            ) : (
              <div>There is no song in database</div>
            )}
          </div>
        </div>

        <div className="recommendArtist">
          <h2>
            Some <span className="">Artist</span>
          </h2>
          <div className="recommendArtist-list">
            {someArtist && someArtist.length > 0 ? (
              someArtist.map((artist, index) => (
                <div className="item" key={artist._id}>
                  <ArtistRecommend artist={artist}></ArtistRecommend>
                </div>
              ))
            ) : (
              <div> There is no artist on database</div>
            )}
          </div>
        </div>
        <div className="top-album">
          <h2>
            Top <span className="">Album</span>
          </h2>
          <div className="top-albumList">
            {someAlbum && someAlbum.length > 0 ? (
              someAlbum.map((album, index) => (
                <div className="item" key={album._id}>
                  <Album1 album={album}></Album1>
                </div>
              ))
            ) : (
              <div>There is no album on databse</div>
            )}
          </div>
        </div>

        {accessToken ? (
          decode.role !== "artist" ? (
            <div className="BecomeArtistFrame JoinUs-frame">
              <h2>Thank for listening. Upload your first song?</h2>
              <div className="title2">
                Upload song and build album. All for free.
              </div>
              <button
                className="becomeArtist-btn2 sign-up-btn2"
                onClick={() => nav("/become-artist")}
              >
                Become artist
              </button>
            </div>
          ) : (
            // <div className="BecomeArtistFrame JoinUs-frame">
            //   <h2>You are an artist now!</h2>
            //   <div className="title2">
            //     Upload songs and build your albums. All for free.
            //   </div>
            // </div>
            <CatComponent></CatComponent>
          )
        ) : (
          <div className="JoinUs-frame">
            <h2>Thank for listening. Now join in.</h2>
            <div className="title1">
              Save tracks, follow artists, and build playlists. All for free.
            </div>
            <button className="sign-up-btn2" onClick={() => nav("/sign-up")}>
              Create account
            </button>
            <div className="sign-in-btn2-frame">
              <div>Already have an account?</div>
              <button onClick={() => nav("/sign-in")}>Sign in</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
