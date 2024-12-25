import ArtistModel from "../../models/ArtistModel.js";
import SongModel from "../../models/SongModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Ffmpeg from "fluent-ffmpeg";
Ffmpeg.setFfprobePath("C:\\ffmpeg\\ffprobe.exe"); //chỉ tới ffprobe.exe

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import util from "util"; // Thư viện Node.js để hỗ trợ promisify

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình multer để xử lý nhiều file
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
}).fields([
  // này để up nhiều file hơn, mỗi cái up 1 file
  { name: "songImg", maxCount: 1 }, //chỉnh lại để up nhiều file hơn
  { name: "audioFile", maxCount: 1 }, //nhớ đẩy postman key là audioFile
]);

// const upload = multer({
//   storage: multer.memoryStorage(),
// }).any(); //cách này để up nhiều file cx được, còn fields để rõ ràng

const singleUpload = multer({
  storage: multer.memoryStorage(),
}).single("file");

const ffprobePromise = (audioUrl) => {
  return new Promise((resolve, reject) => {
    Ffmpeg(audioUrl).ffprobe((err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration); // Trả về duration
    });
  });
};

const SongController = {
  uploadSong: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;

      // Tìm artist liên kết với user
      const artist = await ArtistModel.findOne({ idUser: userId });
      if (!artist) throw new Error("You are not an artist!");
      const idArtist = artist._id; //user nào thì artist đấy (qhe 1-1)
      upload(req, res, async (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res
            .status(400)
            .send({ message: "Error uploading files", error: err.message });
        }
        // console.log("Received files:", req.files);
        // console.log("Received body:", req.body);
        const { songName } = req.body;
        const songImgFile = req.files?.songImg?.[0];
        const audioFile = req.files?.audioFile?.[0];

        if (!songName || !idArtist) {
          return res.status(400).send({ message: "Missing required fields!" });
        }
        // console.log("songImgFile:", songImgFile);
        // console.log("audioFile:", audioFile);
        try {
          // Upload ảnh bài hát lên Cloudinary
          let songImgUrl = null;
          if (songImgFile) {
            const imgFileName = songImgFile.originalname.split(".")[0];
            const imgResult = await cloudinary.uploader.upload(
              `data:${
                songImgFile.mimetype
              };base64,${songImgFile.buffer.toString("base64")}`,
              {
                public_id: imgFileName, // Đặt tên file để dễ tìm
                resource_type: "image",
              }
            );
            songImgUrl = imgResult.secure_url;
          }

          // Upload file audio lên Cloudinary
          let audioUrl = null;
          let duration = null;
          if (audioFile) {
            const audioFileName = audioFile.originalname.split(".")[0];
            const audioResult = await cloudinary.uploader.upload(
              `data:${audioFile.mimetype};base64,${audioFile.buffer.toString(
                "base64"
              )}`,
              {
                public_id: audioFileName,
                resource_type: "video", // Dùng "video" cho audio
              }
            );
            audioUrl = audioResult.secure_url;
            try {
              duration = await ffprobePromise(audioUrl);
              console.log("Audio duration:", duration);
            } catch (ffprobeError) {
              console.error("Error fetching audio metadata:", ffprobeError);
              return res.status(500).send({
                message: "Error fetching audio metadata",
                error: ffprobeError.message,
              });
            }
          }

          // Lưu vào database
          const newSong = await SongModel.create({
            songName,
            idArtist,
            duration,
            songImg: songImgUrl,
            audioURL: audioUrl,
          });

          res.status(201).send({
            message: "Song uploaded successfully!",
            data: newSong,
          });
        } catch (error) {
          res.status(500).send({
            message: "Error uploading song!",
            error: error.message,
          });
        }
      });
    } catch (error) {
      res.status(401).send({ message: error.message });
    }
  },
  //Tìm bài hát bằng id -> để render thông tin ra
  getSongById: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const { songId } = req.query;
      if (!songId) throw new Error("songId is required");
      const songs = await SongModel.findById(songId).populate(
        "idArtist idAlbum"
      ); //lấy cả dữ liệu artist2
      if (!songs) throw new Error("Song is not exist!");
      res.status(201).send({
        message: "This is the song you found!",
        data: songs,
      });
    } catch (error) {
      res.status(201).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Tìm những bài hát của artist (bằng idArtist) -> để render ra pageArtist
  getSongByArtistId: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    try {
      const { artistId, limit } = req.query;

      if (!artistId) throw new Error("artistId is required");

      // Chuyển limit sang số nguyên, || 0 (lấy tất cả)
      const songLimit = parseInt(limit) || 0;

      // Tìm bài hát theo idArtist và giới hạn kết quả
      const songs = await SongModel.find({ idArtist: artistId })
        .populate("idArtist") // Populate cả idArtist và idAlbum
        .populate("idAlbum")
        .limit(songLimit) // Giới hạn số lượng bài hát
        .lean();

      if (!songs.length) throw new Error("No songs found for this artist");

      res.status(200).send({
        message: `Fetched song's successfully`,
        data: songs,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  getSongByAlbumId: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    try {
      const { albumId, limit } = req.query;

      if (!albumId) throw new Error("albumId is required");

      // Chuyển limit sang số nguyên, || 0 (lấy tất cả)
      const songLimit = parseInt(limit) || 0;

      // Tìm bài hát theo idArtist và giới hạn kết quả
      const songs = await SongModel.find({ idAlbum: albumId })
        .populate("idArtist") // Populate cả idArtist và idAlbum
        .populate("idAlbum")
        .limit(songLimit) // Giới hạn số lượng bài hát
        .lean();

      if (!songs.length) throw new Error("No songs found for this album");

      res.status(200).send({
        message: `Fetched song's successfully`,
        data: songs,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  getAllSong: async (req, res) => {
    try {
      const { limit } = req.query;
      const dataLimit = parseInt(limit) || 0;
      const data = await SongModel.find({}).limit(dataLimit);
      res.status(200).send({
        message: `Fetched songs successfully`,
        data: data,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  deletedSongById: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;
      const role = decoded.role;
      //ktra nếu là admin thì cho xóa
      if (role === "admin") {
        await SongModel.findByIdAndDelete(songId);
        return res.status(200).send({
          message: "Song deleted successfully by admin",
        });
      }
      //nếu k phải check
      const artist = await ArtistModel.findOne({ idUser: userId });
      if (!artist) throw new Error("You are not an artist!");

      const { songId } = req.params;
      if (!songId) throw new Error("Song ID is required");

      // để chỉ người tạo bài mới xóa được
      const song = await SongModel.findOne({
        _id: songId,
        idArtist: artist._id,
      });
      if (!song)
        throw new Error(
          "Song not found or does not belong to you or you are not Admin"
        );

      await SongModel.findByIdAndDelete(songId);

      res.status(200).send({
        message: "Song deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  //Api thay đổi thông tin (ảnh, tên bài hát)
  changeSongDetail: [
    singleUpload,
    async (req, res) => {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const { songId } = req.params;
        if (!songId) throw new Error("Song ID is required");
        const artist = await ArtistModel.findOne({ idUser: userId });
        if (!artist) throw new Error("You are not an artist!");
        // để chỉ người tạo bài mới chỉnh được
        const song = await SongModel.findOne({
          _id: songId,
          idArtist: artist._id,
        });
        if (!song)
          throw new Error(
            "Song not found or does not belong to you or you are not Admin"
          );

        const updatedData = {
          songName: req.body.songName,
        };
        // const { userName, age, phoneNumber  } = req.body;
        const file = req.file;
        if (file) {
          try {
            const dataUrl = `data:${
              file.mimetype
            };base64,${file.buffer.toString("base64")}`;
            const fileName = file.originalname.split(".")[0];
            const result = await cloudinary.uploader.upload(dataUrl, {
              public_id: fileName,
              resource_type: "auto",
            });
            if (result && result.secure_url) {
              updatedData.songImg = result.secure_url;
            }
          } catch (error) {
            res.status(500).send({ message: error.message });
          }
        }
        const updatedUser = await SongModel.findByIdAndUpdate(
          songId,
          updatedData,
          { new: true } // Trả về bản ghi sau khi được cập nhật
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).send({
          message: "Updated successful",
          data: updatedUser,
        });
      } catch (error) {
        res.status(401).json({ message: error.message });
      }
    },
  ],
  //thêm tổng thời lượng cho mấy bài hát cũ (nào cần thì mở)
  // upDateDurationSong: async () => {
  //   try {
  //     const songs = await SongModel.find({ duration: { $exists: false } }); // Tìm các bài hát chưa có duration
  //     for (let song of songs) {
  //       try {
  //         const duration = await ffprobePromise(song.audioURL); // Lấy duration từ audioURL
  //         song.duration = duration;
  //         await song.save(); // Lưu lại vào database
  //         console.log(`Updated duration for song: ${song.songName}`);
  //       } catch (err) {
  //         console.error(
  //           `Error fetching duration for song: ${song.songName}`,
  //           err
  //         );
  //       }
  //     }
  //     res.status(200).json("Updated successful!");
  //   } catch (error) {
  //     res.status(500).json(error.message);

  //     console.error("Error fetching songs:", error);
  //   }
  // },
};

export default SongController;
