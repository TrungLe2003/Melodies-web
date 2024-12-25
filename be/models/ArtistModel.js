import mongoose from "mongoose";
import removeAccents from "remove-accents";

// Hàm để chuẩn hóa dữ liệu tìm kiếm
const normalizeString = (str) => {
  return removeAccents(str).toLowerCase().replace(/\s/g, "");
};
/*
  removeAccents: loại bỏ dấu 
  toLowerCase: loại bỏ viết hoa
  replace(/\s/g, ""): bỏ hết dấu cách (trim() chỉ bỏ dấu cách đầu và cuối)
*/

const ArtistSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  artistName: { type: String },
  normalizedArtistName: { type: String }, //này là tên đã chuẩn hóa -> dùng để tìm kiếm
  artistImg: { type: String },
  backGroundImg: { type: String },
  createdAt: { type: Date, default: Date.now },
  artistDescribe: String,
});

// Middleware trước khi lưu
ArtistSchema.pre("save", function (next) {
  this.normalizedArtistName = normalizeString(this.artistName);
  next();
});

/*
  pre: là 1 middleware của mongoose cho phép thực hiện code trước 1 số hành động
 -> pre('save'): ở đây là trước hành động save (vdu: .save() và create())
 this. :this đại diện cho tài liệu đang được lưu.
*/

const ArtistModel = mongoose.model("artists", ArtistSchema);

export default ArtistModel;
