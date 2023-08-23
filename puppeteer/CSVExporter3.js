const puppeteer = require("puppeteer");
const fs = require("fs");

const FILE = "./archived/result.csv";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://tw.news.yahoo.com/");

  // Selector/Crawler.
  // Get the news photo and title.
  const newsElements = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      ".Pos\\(r\\).H\\(100\\%\\).C\\(\\#fff\\).Td\\(u\\)\\:h"
    );
    // return {"image": "src", "title":"string"}
    return Array.from(elements).map((element) => ({
      image: element.querySelector("img").getAttribute("src"),
      title: element.querySelector("div > a").innerText,
    }));
  });

  // CSV header.
  const csvHeader = "Image URL,Title";
  // Write the crawled data into csv.
  const csvData = newsElements
    .map((news) => `"${news.image}","${news.title}"`)
    .join("\n");
  fs.writeFileSync(FILE, `${csvHeader}\n${csvData}`, "utf-8");

  await browser.close();
})();
