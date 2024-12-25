import { Router } from "express";
import UserRouter from "./User/index.js";
import SongRouter from "./Song/index.js";
import ArtistRouter from "./Artist/index.js";
import AlbumRouter from "./album/index.js";
const V1Router = Router();

V1Router.use("/user", UserRouter);
V1Router.use("/song", SongRouter);
V1Router.use("/artist", ArtistRouter);
V1Router.use("/album", AlbumRouter);
export default V1Router;
