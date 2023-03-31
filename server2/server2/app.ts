import http, { IncomingMessage, Server, ServerResponse } from "http";
import cheerio from "cheerio";
const request = require("request");
const url = require("url");

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      let userUrl: any = req.url;
      let webUrl = userUrl.slice(6);

      if (!webUrl) {
        res.statusCode = 400;
        res.end("Please provide a URL to parse");
        return;
      } else {
        request(webUrl, (err: string, response: string, body: string) => {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end("An error occured while fetching the URL");
            return;
          } else {
            const $ = cheerio.load(body);
            const pageTitle = $("head title").text().trim();
            const description = $('head meta[name="description"]').attr(
              "content"
            );
            const images = $("img")
              .map((i: any, el: any) => $(el).attr("src"))
              .get();
            res.end(JSON.stringify({ pageTitle, description, images }));
          }
        });
      }
    }
  }
);
server.listen(3001, () => console.log("listening for requests on port 3001"));
