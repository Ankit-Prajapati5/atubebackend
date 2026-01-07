// const express = require("express");
// const cors = require("cors");
// const { spawn } = require("child_process");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(express.json());

// /* =========================
//    TEST ROUTE
// ========================= */
// app.get("/", (req, res) => {
//   res.send("Backend running ✅");
// });

// /* =========================
//    UNIVERSAL DOWNLOAD ROUTE
//    (YouTube + Facebook + Instagram)
// ========================= */
// app.get("/download", (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).send("URL required");
//   }

//   res.setHeader(
//     "Content-Disposition",
//     'attachment; filename="video.mp4"'
//   );
//   res.setHeader("Content-Type", "video/mp4");

//   const ytDlpPath = path.join(__dirname, "yt-dlp");

//   const yt = spawn(ytDlpPath, [
//     "-f",
//     "bv*+ba/b",              // ✅ best video + best audio
//     "--merge-output-format",
//     "mp4",                   // ✅ force mp4
//     "-o",
//     "-",                     // ✅ stream to stdout
//     url
//   ]);

//   yt.stdout.pipe(res);

//   yt.stderr.on("data", data => {
//     console.error("yt-dlp:", data.toString());
//   });

//   yt.on("close", code => {
//     if (code !== 0) {
//       console.error("yt-dlp exited with code", code);
//       res.end();
//     }
//   });
// });


// /* =========================
//    START SERVER
// ========================= */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Backend running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.get("/download", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL required");

  const filePath = path.join(__dirname, "video.mp4");

  const yt = spawn("./yt-dlp", [
    "-f",
    "bv*+ba/b",
    "--merge-output-format",
    "mp4",
    "-o",
    filePath,
    url
  ]);

  yt.stderr.on("data", d => console.log(d.toString()));

  yt.on("close", () => {
    // ✅ Ab file browser ko send karo
    res.download(filePath, "video.mp4", () => {
      fs.unlinkSync(filePath); // cleanup
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on", PORT);
});
