import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import RootRouter from "./routes/index.js";

await mongoose
  .connect(
    "mongodb+srv://TrungLe2003:Trungcrazy2003@ktgk.ojovp.mongodb.net/SPCKMindx3"
  )
  .then(() => {
    console.log("Connected database!");
  });

const app = express();
app.use(express.json());
app.use(cors());
app.get("", (req, res) => {
  res.send({
    message: "Connected!",
  });
});

app.use("/api", RootRouter);

app.listen(8080, () => {
  console.log("This is Final Project");
});
