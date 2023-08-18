const HCCrawler = require("headless-chrome-crawler");
const CSVExporter = require("headless-chrome-crawler/exporter/csv");
const puppeteer = require("puppeteer");

const FILE = "./tmp/result.csv";

const exporter = new CSVExporter({
  file: FILE,
  fields: ["title", "link"],
  separator: "\t",
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const crawler = await HCCrawler.launch({
    maxDepth: 1,
    exporter,
    evaluatePage: () => ({
      title: document.title,
      link: window.location.href,
    }),
    onSuccess: result => {
      console.log(`Scraped ${result.result.title}`);
    },
  });

  await crawler.queue({
    url: "https://tw.news.yahoo.com/",
    userData: { label: "yahoo-news" },
  });

  await crawler.onIdle();
  await crawler.close();
  await browser.close();
})();