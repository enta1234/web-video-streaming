const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json({encode: true }))

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/viewer.html");
});

app.get('/video', (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const vdoSize = fs.statSync('./v1.mp4').size

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, vdoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${vdoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  const vdoStream = fs.createReadStream('./v1.mp4', { start, end });
  vdoStream.pipe(res)
})

app.listen(3000, console.log('start at 3000'))
