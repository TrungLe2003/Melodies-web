import ArtistModel from "../../models/ArtistModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
}).fields([
  { name: "backGroundImg", maxCount: 1 }, //chỉnh lại để up nhiều file hơn
  { name: "artistImg", maxCount: 1 }, //nhớ đẩy postman key là artistImg
]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ArtistController = {
  getAllArtist: async (req, res) => {
    try {
      const { limit } = req.query;
      const dataLimit = parseInt(limit) || 0;
      const data = await ArtistModel.find({}).limit(dataLimit);
      res.status(200).send({
        message: `Fetched artist's successfully`,
        data: data,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  getArtistByUserId: async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) throw new Error("No token provided");
    try {
      const { idUser } = req.params;
      const artist = await ArtistModel.findOne({ idUser: idUser });
      if (!artist) throw new Error("Artist not found!");
      res.status(201).send({
        message: "This is your artist information",
        data: artist,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Chỉnh sửa thông tin của artist
  updatedDetailsArtist: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;
      const artist = await ArtistModel.findOne({ idUser: userId });
      if (!artist) throw new Error("You are not an artist!");
      upload(req, res, async (err) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "Error uploading files", error: err.message });
        }

        const { artistName, artistDescribe } = req.body;
        const backGroundImgFile = req.files?.backGroundImg?.[0];
        const artistImgFile = req.files?.artistImg?.[0];

        artist.artistName = artistName || artist.artistName;
        artist.artistDescribe = artistDescribe || artist.artistDescribe; //tránh trường hợp k gửi

        try {
          const uploadPromises = [];
          if (backGroundImgFile) {
            const dataUrl1 = `data:${
              backGroundImgFile.mimetype
            };base64,${backGroundImgFile.buffer.toString("base64")}`;
            const file1Name = backGroundImgFile.originalname.split(".")[0];
            const uploadBg = await cloudinary.uploader.upload(dataUrl1, {
              public_id: file1Name,
              resource_type: "auto",
            });
            uploadPromises.push(uploadBg);
          }
          if (artistImgFile) {
            const dataUrl2 = `data:${
              artistImgFile.mimetype
            };base64,${artistImgFile.buffer.toString("base64")}`;
            const file2Name = artistImgFile.originalname.split(".")[0];
            const uploadImg = await cloudinary.uploader.upload(dataUrl2, {
              public_id: file2Name,
              resource_type: "auto",
            });
            uploadPromises.push(uploadImg);
          }

          //chờ up xong hết để tránh lỗi không gửi được cái sau
          const results = await Promise.all(uploadPromises);

          results.forEach((result, index) => {
            if (result.secure_url) {
              if (index === 0) artist.backGroundImg = result.secure_url;
              else artist.artistImg = result.secure_url;
            }
          });

          await artist.save();
          res.status(201).send({
            message: "Updated successful",
            data: artist,
          });
        } catch (error) {
          res.status(401).json({ message: error.message });
        }
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },
  getArtistById: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const { artistId } = req.query;
      if (!artistId) throw new Error("songId is required");
      const artist = await ArtistModel.findById(artistId)
        .populate("idUser")
        .lean(); //lấy cả dữ liệu artist2, thêm lean để giảm dữ liệu k cần thiết
      if (!artist) throw new Error("Artist is not exist!");
      res.status(201).send({
        message: "This is your artist information!",
        data: artist,
      });
    } catch (error) {
      res.status(201).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default ArtistController;
