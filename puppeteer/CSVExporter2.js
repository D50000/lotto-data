const HCCrawler = require("headless-chrome-crawler");
const CSVExporter = require("headless-chrome-crawler/exporter/csv");
const puppeteer = require("puppeteer");
const fs = require("fs");

const FILE = "./tmp/result.csv";

const exporter = new CSVExporter({
  file: FILE,
  fields: ["image", "link", "response.url"],
  separator: "\t",
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const crawler = await HCCrawler.launch({
    maxDepth: 1,
    exporter,
    evaluatePage: () => {
      const imageElement = document.getElementsByClassName(
        "Pos(a) W(100%) H(100%)"
      )[0];
      const imageSrc = imageElement ? imageElement.getAttribute("src") : "";
      return {
        image: imageSrc,
        link: window.location.href,
      };
    },
    onSuccess: (result) => {
      console.log(`Scraped ${result.result.image} | ${result.result.link}`);
    },
  });

  await crawler.queue({
    url: "https://tw.news.yahoo.com/",
    userData: { label: "yahoo-news" },
  });

  await crawler.onIdle();
  await crawler.close();
  await browser.close();

  // 將資料寫入 CSV 檔案
  const csvData = fs.readFileSync(FILE, "utf-8");
  console.log(csvData); // 將寫入的資料印出來
})();
