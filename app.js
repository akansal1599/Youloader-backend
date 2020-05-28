// Import dependencies
const express = require("express");
const youtubedl = require("youtube-dl");

const app = express();
const port = 5000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.get("/", async (req, res) => {

    if (!req.query.url || req.query.url.length===0) {
        // Send error response
        res.status(400).send({
            ok: false,
            error: "No URL"
        });
        return;
    }

    // How to Write a JavaScript Promise - https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8
    const download = new Promise(function (resolve, reject) {
        console.log(__dirname);
        console.log(process.cwd());
        // Download the YouTube video
        youtubedl.exec(req.query.url, ["--format=bestvideo[height<=1080]+bestaudio/best[height<=1080]","--output=~/Desktop/%(title)s.%(ext)s"], { cwd: __dirname },
            (err, output) => {
                if (err) reject(err);

                resolve(output);
            })
    });

    try {
        console.log(__dirname);
        // Await the downloader
        const output = await download;
        res.download(__dirname +'/Video',output);
        // Send response
        res.status(200).send({
            ok: true,
            result: output
        });


    } catch (error) {

        // Send error response
        res.status(500).send({
            ok: false,
            error: err.message
        });

    }

});
// () => console.log(`Downloader listening at http://localhost:${port}`)
app.listen( process.env.PORT || port);
