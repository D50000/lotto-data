const HCCrawler = require("headless-chrome-crawler");
const CSVExporter = require("headless-chrome-crawler/exporter/csv");

const FILE = "./tmp/result.csv";

const exporter = new CSVExporter({
  file: FILE,
  // Crawler Target and it will be the csv columns.
  fields: ["response.url", "response.status", "links.length"],
  separator: "\t",
});

(async () => {
  const crawler = await HCCrawler.launch({
    maxDepth: 2,
    exporter,
  });
  try {
    await crawler.queue("https://tw.news.yahoo.com/");
    await crawler.onIdle();
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await crawler.close();
  }
})();
