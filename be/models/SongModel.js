import mongoose from "mongoose";
import removeAccents from "remove-accents";

const normalizeString = (str) => {
  return removeAccents(str).toLowerCase().replace(/\s/g, "");
};

const songSchema = new mongoose.Schema({
  songName: String,
  duration: Number,
  normalizedSongName: String,
  idArtist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artists",
    required: true,
  },
  idAlbum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "albums",
  },
  songImg: String,
  audioURL: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

songSchema.pre("save", function (next) {
  this.normalizedSongName = normalizeString(this.songName);
  next();
});

const SongModel = mongoose.model("songs", songSchema);

export default SongModel;
