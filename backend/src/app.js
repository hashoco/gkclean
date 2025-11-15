import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import inquiryRouter from "./inquiry.js";  // ⭐ 반드시 필요

const app = express();


app.use(cors());
app.use(express.json());

// 문의 API
app.use("/api/inquiry", inquiryRouter);

// 기본 확인용
app.get("/", (req, res) => {
  res.send("GKClean Backend Running");
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
