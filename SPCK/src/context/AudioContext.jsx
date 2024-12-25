import React, { createContext, useContext, useState } from "react";

const AudioContext = createContext();

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [songListContext, setSongListContext] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const playNext = () => {
    if (!songListContext || songListContext.length === 0) return;
    const currentIndex = songListContext.findIndex(
      (song) => song._id === currentSong?._id
    );
    const nextIndex = (currentIndex + 1) % songListContext.length; // Quay vòng về đầu nếu hết danh sách
    playSong(songListContext[nextIndex]);
  };
  /*
  Giải thích: % là lấy số dư
  vdu: currentIndex = 0 //bài đầu
  vậy bài tiếp theo = (0 + 1) % 5 (vdu list có 5 bài) = 1
   1/5=0 dư 1
  => như này sẽ tránh khi currentIndex là 4 (bài cuối)
   vậy bài tiếp theo = (4 + 1) % 5 = 5 % 5 = 0 -> chuyển về bài đầu 
  */

  const playPrevious = () => {
    if (!songListContext || songListContext.length === 0) return;
    const currentIndex = songListContext.findIndex(
      (song) => song._id === currentSong?._id
    );
    const prevIndex =
      (currentIndex - 1 + songListContext.length) % songListContext.length; // Quay vòng về cuối nếu lùi quá
    playSong(songListContext[prevIndex]);
  };
  /*
  Giải thích: tương tự ở trên
  vdu crrIndex = 2 // bài thứ 3
  prevIndex = (2 - 1 + 5) % 5 = 1 //bài thứ 2
  crrIndex = 0 //bài đầu tiên
  prevIndex = (0 - 1 + 5) % 5 = 4 //bài cuối 
  */

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        setCurrentSong,
        songListContext,
        setSongListContext,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

//Lảm chức năng chuyển bài hát -> Thêm phần songsList vào context để chuyển bài + thêm 2 hàm chuyển bài
