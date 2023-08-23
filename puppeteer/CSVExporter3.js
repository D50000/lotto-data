const puppeteer = require("puppeteer");
const fs = require("fs");

const FILE = "./tmp/result.csv";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://tw.news.yahoo.com/");

  // Selector/Crawler.
  // Get the news photo
  const imageElements1 = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      ".Pos\\(r\\).H\\(100\\%\\).C\\(\\#fff\\).Td\\(u\\)\\:h > img"
    ); // escape character
    return Array.from(elements).map((element) => element.getAttribute("src"));
  });
  // Get the news photo's title.
  const imageElements2 = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      ".Pos\\(r\\).H\\(100\\%\\).C\\(\\#fff\\).Td\\(u\\)\\:h > div > a"
    ); // escape character
    return Array.from(elements).map((element) => element.getInnerHTML());
  });

  // CSV header.
  const csvHeader = "Image URL";
  // Write the crawled data into csv.
  const csvData = imageElements1.map((image) => `"${image}"`).join("\n");
  fs.writeFileSync(FILE, csvData, "utf-8");

  await browser.close();
})();
