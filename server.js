const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* =========================
   YOUTUBE DOWNLOAD (yt-dlp)
========================= */
app.get("/youtube-download", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URL required");
  }

  // Response headers
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="youtube-video.mp4"'
  );
  res.setHeader("Content-Type", "video/mp4");

  // 🔥 Linux compatible yt-dlp command
  const yt = spawn("yt-dlp", [
    "-f",
    "mp4",
    "-o",
    "-",
    url
  ]);

  yt.stdout.pipe(res);

  yt.stderr.on("data", (data) => {
    console.error("yt-dlp error:", data.toString());
  });

  yt.on("close", (code) => {
    if (code !== 0) {
      console.error("yt-dlp exited with code", code);
      res.end();
    }
  });
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("✅ Backend running on port 5000");
});
