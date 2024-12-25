import bcrypt from "bcrypt";
import UserModel from "../../models/UserModel.js";
import ArtistModel from "../../models/ArtistModel.js";
import SongModel from "../../models/SongModel.js";
import AlbumModel from "../../models/AlbumModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import removeAccents from "remove-accents";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
//cấu hình cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//cấu hình multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Chuẩn hóa dữ liệu cho hàm tìm kiếm
const normalizeString = (str) => {
  return removeAccents(str).toLowerCase().replace(/\s/g, "");
};

const userController = {
  register: async (req, res) => {
    try {
      const { email, password, phoneNumber } = req.body;

      // Validate tại BE
      if (!email || email.length < 6) {
        return res
          .status(400)
          .send({ message: "Email must be at least 6 characters." });
      }
      if (!password || password.length < 6) {
        return res
          .status(400)
          .send({ message: "Password must be at least 6 characters." });
      }

      // Hash password và tạo người dùng
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        phoneNumber,
      });
      res.status(201).send({
        message: "Successful!",
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  logIn: async (req, res) => {
    try {
      const data = { email: req.body.email, password: req.body.password };
      if (!data.email || !data.password) {
        return res.status(400).send({
          message: "Email and password are required",
        });
      }
      //tìm email
      const findAccount = await UserModel.findOne({ email: data.email });
      if (!findAccount) {
        return res.status(404).send({
          message: "Email is invalid",
        });
      }
      //so sánh password
      const comparePassword = bcrypt.compareSync(
        data.password,
        findAccount.password
      );
      if (!comparePassword) {
        res.status(401).send({
          message: "Password is invalid",
        });
        return;
      }
      //trả token
      const accessToken = jwt.sign(
        {
          id: findAccount._id,
          email: findAccount.email,
          role: findAccount.role,
        }, //Payload cua token
        SECRET_KEY,
        { expiresIn: 60 * 60 * 24 * 7 * 4 }
      );
      const refreshToken = jwt.sign(
        {
          id: findAccount._id,
          email: findAccount.email,
          role: findAccount.role,
        },
        SECRET_KEY,
        {
          expiresIn: 60 * 60 * 24 * 7 * 4,
        }
      );
      res.status(200).send({
        message: "Login Successful",
        accessToken,
        refreshToken,
        role: findAccount.role,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Chuyển từ user sang artist, đổi role user -> artist
  becomeArtist: async (req, res) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) throw new Error("No token provided");
    try {
      const decoded = jwt.verify(accessToken, SECRET_KEY);
      const userId = decoded.id;
      const crrUser = await UserModel.findById(userId);
      if (!crrUser) throw new Error("User not found!");
      if (crrUser.role === "artist") throw new Error("Already an artist");

      //cập nhật role
      crrUser.role = "artist";
      await crrUser.save();

      // Tạo artist mới trong ArtistModel
      const newArtist = new ArtistModel({
        idUser: crrUser._id, //Qhe 1-1
        artistName: crrUser.userName,
      });
      await newArtist.save();

      res.status(200).send({
        message: "You are artist now!",
        data: { user: crrUser, artist: newArtist },
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Thay đổi thông tin, có cả avatar, tải ảnh lên cloudinary
  addUserDetail: [
    upload.single("file"),
    async (req, res) => {
      const token = req.headers["authorization"]?.split(" ")[1];
      //gửi Barrer <token> lên header có key authorization (trong postman)
      console.log("token", token);

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const updatedData = {
          userName: req.body.userName,
          age: req.body.age,
          phoneNumber: req.body.phoneNumber,
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
              updatedData.avatarImg = result.secure_url;
            }
          } catch (error) {
            res.status(500).send({ message: error.message });
          }
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
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
  changePassword: async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "No token provided!" });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).send({
          message: "Current and new password are required!",
        });
      }
      console.log("Received data:", req.body); // Log để kiểm tra xem dữ liệu có đúng không

      const crrUser = await UserModel.findById(userId);
      if (!crrUser) {
        return res.status(404).send({ message: "User not found!" });
      }

      const checkPasswordValid = bcrypt.compareSync(
        currentPassword,
        crrUser.password
      );
      if (!checkPasswordValid) {
        return res
          .status(400)
          .send({ message: "Current password is incorrect!" });
      }

      if (newPassword.length < 6) {
        return res.status(400).send({
          message: "New password must be at least 6 characters!",
        });
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      crrUser.password = hashedNewPassword;
      await crrUser.save();

      res.status(200).send({
        message: "Password changed successfully!",
      });
      console.log("Response sent to client: Password changed successfully!");
    } catch (error) {
      console.error("Error while changing password:", error.message);
      console.error("Error after response:", error);
      res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  },

  getUserList: async (req, res) => {
    try {
      const data = await UserModel.find({});
      res.status(201).send({
        message: "This is all Users",
        data: data,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  getUserDetails: async (req, res) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!accessToken) throw new Error("No token provided! ");
    try {
      const decoded = jwt.verify(accessToken, SECRET_KEY);
      const userId = decoded.id;
      const findUser = await UserModel.findById(userId);
      if (!findUser) throw new Error("User not found!");
      res.status(201).send({
        message: "This is your information",
        data: findUser,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Chuẩn hóa (thêm tên không dấu không cách) -> vì các dữ liệu cũ chưa có
  updatedNormalizedNameForDatabase: async (req, res) => {
    try {
      const artists = await ArtistModel.find();
      for (const artist of artists) {
        artist.normalizedArtistName = normalizeString(artist.artistName);
        await artist.save();
      }
      const songs = await SongModel.find();
      for (const song of songs) {
        song.normalizedSongName = normalizeString(song.songName);
        await song.save();
      }
      const albums = await AlbumModel.find();
      for (const album of albums) {
        album.normalizedAlbumName = normalizeString(album.albumName);
        await album.save();
      }
      res.status(200).json("Cập nhật thành công");
      console.log("Cập nhật dữ liệu thành công!");
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      res.status(500).json(error.message);
    }
  },
  // Để hàm tìm kiếm ở đây (tại cx là user tìm kiếm :)))
  searchingInformation: async (req, res) => {
    const searchQuery = normalizeString(req.query.q || "");

    try {
      const [songs, artists, albums] = await Promise.all([
        SongModel.find({
          normalizedSongName: { $regex: searchQuery, $options: "i" },
        })
          .limit(6)
          .populate("idArtist", "artistName"),
        ArtistModel.find({
          normalizedArtistName: { $regex: searchQuery, $options: "i" },
        }).limit(6),
        AlbumModel.find({
          normalizedAlbumName: { $regex: searchQuery, $options: "i" },
        })
          .limit(4)
          .populate("idArtist", "artistName"),
        ,
      ]);
      const topResults = songs.slice(0, 3);

      res.status(200).send({
        message: "This are all you found!",
        topResults,
        songs,
        artists,
        albums,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  /*
    Promise.all: hàm của JvS dùng để chạy nhiều promise cùng lúc, nếu thành công sẽ trả ra các mảng tương ứng với các Promise. 1 Promise bị lỗi sẽ dừng lại 
    $regex: là toán tử trong mongoose để so khớp chuỗi tìm kiếm trong database
    $options: 'i': i là một option trong Regular Expression có nghĩa là "case-insensitive" -> giúp không phân biệt chữ hoa hay thường 
  */
};

export default userController;
