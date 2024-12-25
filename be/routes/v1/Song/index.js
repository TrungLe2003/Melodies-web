import { Router } from "express";
import SongController from "../../../controllers/song/songController.js";
const SongRouter = Router();

SongRouter.post("/uploadSong", SongController.uploadSong);
//tìm song bằng idArtist
SongRouter.get("/getSong", SongController.getSongByArtistId);
// tìm song bằng id bài
SongRouter.get("", SongController.getSongById);
//tìm song bằng id artist
SongRouter.get("/getAlbumSong", SongController.getSongByAlbumId);
//lấy tất cả song (có thể có limit)
SongRouter.get("/getAllSongs", SongController.getAllSong);

//xóa bài hát
SongRouter.delete("/deletedSong/:songId", SongController.deletedSongById);
//update bài hát
SongRouter.put("/changeDetails/:songId", SongController.changeSongDetail);
//Thêm duration cho các bài hát cũ
// SongRouter.put("/updateDuration", SongController.upDateDurationSong);

export default SongRouter;
