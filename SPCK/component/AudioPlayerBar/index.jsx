import { useAudio } from "../../src/context/AudioContext";
import { useEffect, useRef, useState } from "react";
//
import PlayBtnIcon from "../../src/assets/BtnPlayIcon";
import NextBtnIcon from "../../src/assets/PlayAudioBar/NextBtnIcon";
import PreviousBtnIcon from "../../src/assets/PlayAudioBar/PreviousBtnIcn";
import VolumeIcon from "../../src/assets/PlayAudioBar/VolumeIcon";
import ResetBtnIcon from "../../src/assets/resetBtnIcon";
//
import "./style.css";

//Từng bước để chạy Audio
/*
Vdu: lấy thông tin bài hát (song) ở artistPage trước
-useEffect: Nếu đã có currentSong 
(1): MusicFrame3 truyền song vào hàm playSong(context) -> crrSong(song) và isPlaying(true)
(2): Nếu có crrSong(song) -> gán Url của song vào biến audio (biến audio được gán bằng audioRef để sử dụng các hàm)
*/

const AudioPlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    pauseSong,
    playSong,
    setCurrentSong,
    playNext,
    playPrevious,
  } = useAudio();
  const [currentTime, setCurrentTime] = useState(0); //tgian hiện tại (s)
  const [duration, setDuration] = useState(0); //tổng thời lượng (s)
  const [volume, setVolume] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false); //dùng để chặn bấm nhiều lần gây lag
  const audioRef = useRef(new Audio()); //này để phát bài hát

  useEffect(() => {
    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.audioURL || ""; //(2)
      // Đảm bảo audioURL không undefined
      audio.load(); // Reset audio
      if (isPlaying) {
        audio
          .play() //Phát nhạc bằng hàm này
          .catch((error) => console.error("Error playing audio:", error));
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      if (audio.currentTime >= audio.duration && audio.duration > 0) {
        playNext();
      } //hàm này để hiển thị thời gian đang phát và chuyển bài
    }; //cập nhật time liên tục
    const handleLoadedData = () => setDuration(audio.duration || 0); //cập nhật thời lượng

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadeddata", handleLoadedData);

    return () => {
      // audio.pause();
      // audio.currentTime = 0; // Reset thời gian phát
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [currentSong]);

  const handlePlayPause = async () => {
    if (isProcessing) return; // Chặn nhấn liên tiếp
    setIsProcessing(true);

    const audio = audioRef.current;
    //đoạn này chỉnh bật thì tắt, tắt thì bật thoai
    try {
      if (audio.paused) {
        await audio.play();
        playSong(currentSong);
      } else {
        audio.pause();
        pauseSong();
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration; //tính lại % giá trị mới
    audioRef.current.currentTime = newTime; //chỉnh lại thời gian của audio bằng giá trị mới
    setCurrentTime(newTime); //chỉnh lại thời gian (này cho thanh chạy ở web)
  };

  const handleVolumeChange = (e) => {
    //này tương tự hàm trên
    const newVolume = e.target.value / 100; //đoạn này chia để trờ lại thành 0 -> 1
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleResetSong = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  if (!currentSong) {
    return <div></div>;
  }

  return (
    <div className="AudioPlayerBar">
      <div className="songInfo">
        {isPlaying && (
          <div class="loaderMusicPlay">
            <div class="loading">
              <div class="load"></div>
              <div class="load"></div>
              <div class="load"></div>
              <div class="load"></div>
              <div class="load"></div>
            </div>
          </div>
        )}
        {isPlaying ? (
          <img
            src={currentSong.songImg}
            alt={currentSong.songName}
            className="isPlaying"
          />
        ) : (
          <img
            src={currentSong.songImg}
            alt={currentSong.songName}
            className="notPlaying"
          />
        )}
        {/* <img src={currentSong.songImg} alt={currentSong.songName} className="notPlaying"/> */}
        <div className="songNameAndArtist">
          <div className="songName">{currentSong.songName}</div>
          <div className="artistName">{currentSong.artistName}</div>
        </div>
      </div>
      <div className="controls">
        <div className="controlsBtn">
          <div onClick={playPrevious} className="changeSong">
            <PreviousBtnIcon></PreviousBtnIcon>
          </div>
          <button
            onClick={handlePlayPause}
            disabled={isProcessing}
            className="playOrPauseBtn"
          >
            {isPlaying ? (
              "||"
            ) : (
              <PlayBtnIcon
                style={{ width: "20px", height: "20px" }}
              ></PlayBtnIcon>
            )}
          </button>
          <div onClick={playNext} className="changeSong">
            <NextBtnIcon></NextBtnIcon>
          </div>
        </div>
        <div className="setTimeFrame">
          <span>{formatTime(currentTime)}</span>
          {/* truyền vô tgian hiện tại (ở dưới là thời lượng) => đổi ra phút với giây */}
          <input
            type="range"
            min="0" //này chia ra từ 0% tới 100%
            max="100"
            value={(currentTime / duration) * 100 || 0} //để tính % thời gian đã trôi qua
            onChange={handleSeek}
            className="setTime"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="RightFrame">
        <div className="moreActionFrame">
          <div className="resetBtn" onClick={handleResetSong}>
            <ResetBtnIcon></ResetBtnIcon>
          </div>
        </div>
        <div className="setVolumeFrame">
          <VolumeIcon></VolumeIcon>
          <input
            type="range"
            //vì volume có giá trị từ 0 -> 1 nên nhân với 100 để ra %
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="setVolume"
          />
        </div>
      </div>
      <div
        className="TurnOffMusic"
        onClick={() => {
          audioRef.current.pause(); // Tạm dừng nhạc
          setCurrentSong(null); // Xóa thông tin bài hát
          setIsPlaying(false); // Cập nhật trạng thái
        }}
      >
        X
      </div>
    </div>
  );
};

export const formatTime = (time) => {
  if (isNaN(time)) return "00:00"; //Ktra xem time phải số hợp lệ không -> k thì mặc định 00:00
  const minutes = Math.floor(time / 60); //số phút = chia 60 (số giây) -> lấy phần nguyên (floor)
  const seconds = Math.floor(time % 60) //số giây còn lại khi đủ số phút
    .toString() //chuyển thành chuỗi để dùng hàm
    .padStart(2, "0"); //nếu độ dài ít hơn 2 chữ số thì thêm 0
  return `${minutes}:${seconds}`;
};

export default AudioPlayerBar;

/*
vdu: crrTime = 125
minutes = 125/60 = 2.08...  -> 2
seccont = 125%60 = 5 (còn 5 giây) -> 05
=> 2:05
*/
