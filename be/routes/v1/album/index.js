import { Router } from "express";
import AlbumController from "../../../controllers/album/albumController.js";
const AlbumRouter = Router();

AlbumRouter.post("/createAlbum/:idArtist", AlbumController.createAlbum);
//Lấy album bằng artistId
AlbumRouter.get("/getAlbums", AlbumController.getAlbumsByArtistId);
//Lấy album bằng albumId
AlbumRouter.get("", AlbumController.getAlbumById);
//Lấy all album (có thể có limit)
AlbumRouter.get("/getAllAlbums", AlbumController.getAllAlbum);

//Thêm bài hát vô album
AlbumRouter.put("/:idAlbum", AlbumController.addSongToAlbum);

export default AlbumRouter;
