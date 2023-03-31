"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cheerio_1 = __importDefault(require("cheerio"));
const request = require("request");
const url = require("url");
/*implement your server code here*/
const server = http_1.default.createServer((req, res) => {
    if (req.method === "GET") {
        let userUrl = req.url;
        let webUrl = userUrl.slice(6);
        console.log(webUrl);
        if (!webUrl) {
            res.statusCode = 400;
            res.end("Please provide a URL to parse");
            return;
        }
        else {
            request(webUrl, (err, response, body) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end("An error occured while fetching the URL");
                    return;
                }
                else {
                    const $ = cheerio_1.default.load(body);
                    const pageTitle = $("head title").text().trim();
                    const description = $('head meta[name="description"]').attr("content");
                    const images = $("img")
                        .map((i, el) => $(el).attr("src"))
                        .get();
                    res.end(JSON.stringify({ pageTitle, description, images }));
                }
            });
        }
    }
});
server.listen(3001, () => console.log("listening for requests on port 3001"));
