import mongoose from "mongoose";
import removeAccents from "remove-accents";

const normalizeString = (str) => {
  return removeAccents(str).toLowerCase().replace(/\s/g, "");
};

const AlbumSchema = new mongoose.Schema({
  idArtist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artists",
    required: true,
  },
  albumName: { type: String },
  normalizedAlbumName: String,
  albumImg: { type: String },
  createdAt: { type: Date, default: Date.now },
});

AlbumSchema.pre("save", function (next) {
  this.normalizedAlbumName = normalizeString(this.albumName);
  next();
});

const AlbumModel = mongoose.model("albums", AlbumSchema);

export default AlbumModel;
