import { Router } from "express";
import ArtistController from "../../../controllers/artist/artistController.js";
const ArtistRouter = Router();

//Lấy thông tin artist
ArtistRouter.get("/detail/:idUser", ArtistController.getArtistByUserId);
ArtistRouter.get("", ArtistController.getArtistById); //lấy 1 = id
ArtistRouter.get("/allArtist", ArtistController.getAllArtist); //lấy 1 = id

//Updated thông tin artist, cho artist page
ArtistRouter.put("/detail/updated", ArtistController.updatedDetailsArtist);

export default ArtistRouter;
