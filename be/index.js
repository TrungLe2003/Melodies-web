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
app.use(cors()); //cho phép tất cả origin

// const corsOptions = {
//   origin: ["http://localhost:5173", "http://localhost:5174"], // Cho phép cả hai origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.get("", (req, res) => {
  res.send({
    message: "Connected!",
  });
});

app.use("/api", RootRouter);

app.listen(8081, () => {
  console.log("This is Final Project");
});
