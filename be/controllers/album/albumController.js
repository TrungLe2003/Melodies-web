import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import AlbumModel from "../../models/AlbumModel.js";
import SongModel from "../../models/SongModel.js";
import ArtistModel from "../../models/ArtistModel.js";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const singleUpload = multer({
  storage: storage,
}).single("file");

const AlbumController = {
  getAllAlbum: async (req, res) => {
    try {
      const { limit } = req.query;
      const dataLimit = parseInt(limit) || 0;
      const data = await AlbumModel.find({}).limit(dataLimit);
      res.status(200).send({
        message: `Fetched albums successfully`,
        data: data,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  getAlbumById: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const { albumId } = req.query;
      if (!albumId) throw new Error("albumId is required");
      const crrAlbum = await AlbumModel.findById(albumId).populate("idArtist"); //lấy cả dữ liệu artist2
      if (!crrAlbum) throw new Error("Album is not exist!");
      res.status(201).send({
        message: "This is the album you found!",
        data: crrAlbum,
      });
    } catch (error) {
      res.status(201).send({
        message: error.message,
        data: null,
      });
    }
  },
  createAlbum: [
    singleUpload,
    async (req, res) => {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) throw new Error("No token provided");
      try {
        const { idArtist } = req.params;
        const { albumName } = req.body;
        const newData = {
          idArtist,
          albumName,
        };
        const file = req.file;
        if (!file) {
          return res.status(400).json({ message: "File is required" });
        }

        try {
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
          )}`;
          const fileName = file.originalname.split(".")[0];
          const result = await cloudinary.uploader.upload(dataUrl, {
            public_id: fileName,
            resource_type: "auto",
          });
          if (result && result.secure_url) {
            newData.albumImg = result.secure_url;
          }
        } catch (error) {
          res.status(500).send({ message: error.message });
        }

        const newAlbumData = await AlbumModel.create(newData);
        res.status(200).send({
          message: "Your new album",
          data: newAlbumData,
        });
      } catch (error) {
        res.status(401).json({ message: error.message });
      }
    },
  ],
  getAlbumsByArtistId: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const { artistId, limit } = req.query;

      if (!artistId) throw new Error("artistId is required");
      const songLimit = parseInt(limit) || 0;
      const albums = await AlbumModel.find({ idArtist: artistId })
        .populate("idArtist")
        .limit(songLimit) // cần này để áp dới hạn vô (giống phân trang ấy)
        .lean();
      if (!albums.length) throw new Error("No albums found for this artist");

      res.status(200).send({
        message: "This is all your song",
        data: albums,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  addSongToAlbum: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;
      const role = decoded.role;

      const artist = await ArtistModel.findOne({ idUser: userId });
      if (!artist) throw new Error("You are not an artist!");

      const { idAlbum } = req.params;
      if (!idAlbum)
        throw new Error(
          "Song not found or does not belong to you or you are not Admin"
        );

      const album = await AlbumModel.findOne({
        _id: idAlbum,
        idArtist: artist._id,
      });

      if (!album) throw new Error("No album provided");

      const { songIdAdded } = req.query;
      if (!songIdAdded) throw new Error("You must choose a song to add");

      const addSong = await SongModel.findByIdAndUpdate(
        songIdAdded,
        {
          idAlbum: idAlbum,
        },
        { new: true }
      );
      res.status(200).send({
        message: "Add song to album successful",
        data: addSong,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default AlbumController;
