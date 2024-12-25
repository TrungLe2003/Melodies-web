import "./style3.css";
//
import { formatTime } from "../AudioPlayerBar";
//
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayBtnIcon from "../../src/assets/BtnPlayIcon";
import { useAudio } from "../../src/context/AudioContext";
const MusicFrame3 = ({ song, artistInfo }) => {
  const { currentSong, isPlaying, playSong, pauseSong } = useAudio();
  const nav = useNavigate();
  const handlePlayPause = () => {
    if (currentSong?.audioURL === song.audioURL) {
      isPlaying ? pauseSong() : playSong(song);
    } else {
      playSong(song);
    }
  };
  const handleClick = () => {
    nav(`/song/${song._id}`); //dùng params truyền dữ liệu
  };

  return (
    <div className="musicFrame3">
      <div className="SonginforLeft">
        <div className="playPauseBtn" onClick={handlePlayPause}>
          {currentSong?.audioURL === song.audioURL && isPlaying ? (
            "||"
          ) : (
            <PlayBtnIcon
              style={{ width: "25px", height: "25px" }}
            ></PlayBtnIcon>
          )}
        </div>
        <img src={song.songImg} alt="" />
        <div className="nameSong-author">
          <div className="song" onClick={handleClick}>
            {song.songName}
          </div>
          <div className="author">{artistInfo.artistName}</div>
        </div>
      </div>

      <div className="SonginforRight">
        <div className="btnAddToPlaylist">+</div>
        <div className="time">{formatTime(song.duration)}</div>
        <div className="checkMore">...</div>
      </div>
    </div>
  );
};

export default MusicFrame3;
