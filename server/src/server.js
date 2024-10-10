import express from 'express';
import fs from 'node:fs';
import { errorHandler } from './middleware/error.mw.js';
import { fileURLToPath } from "url";
import path from 'node:path';
import * as fsPromises from "node:fs/promises";

const PORT = process.env['PORT'] || 5000;
const CHUNK_SIZE = 1 * 1024 * 1024;
const app = express();

const staticsPath = fileURLToPath(new URL(".", import.meta.url));

const checkImageExists = async (imagePath) => {
  return fsPromises
    .access(imagePath)
    .then(() => true)
    .catch((err) => {
      console.error(`File at ${imagePath} does not exist!`, err);
      return false;
    });
};

app.get('/videos/:id', (req, res, next) => {
    try {
        if (
            !req.params.id ||
            req.params.id.trim() === null
        ) {
            throw new Error('File not found!');
        } else{
            // Check if file exists
            const filePath = path.join(staticsPath,`./videos/demo${req.params.id}.mp4`);
            
            // If file does not exists, send error res
            if (!filePath || !checkImageExists(filePath)) return res.status(404).send("File not found");
            else {
              const fileStats = fs.statSync(filePath);
              const fileSize = fileStats.size;

              const rangeHeader = req.headers?.range;
              
              if (rangeHeader) {
                const partsToStreamNext = rangeHeader
                  .replace(/bytes=/, "")
                  .split("-");
                const start = parseInt(partsToStreamNext[0], 10);
                const end = partsToStreamNext[1]
                  ? parseInt(partsToStreamNext[1], 10)
                  : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

                console.log(`File ${filePath} being sent from:`, start, end);

                if (start >= fileSize || end >= fileSize || start > end) {
                  res.status(416).send("Requested Range Not Satisfiable");
                  return;
                } else {
                  const chunkSize = end - start + 1;
                  const fileStream = fs.createReadStream(filePath, {
                    start,
                    end,
                  });

                  const resHeaders = {
                    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunkSize,
                    "Content-Type": "video/mp4",
                  };
                  // 206 => Partial Content
                  res.writeHead(206, resHeaders);
                  fileStream.pipe(res);
                }
              } else {
                const resHeaders = {
                  "Content-Length": fileSize,
                  "Content-Type": "video/mp4",
                };
                // If no range header, server entire file
                res.writeHead(200, resHeaders);
                fs.createReadStream(filePath).pipe(res);
              }
            }
        }
        
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
