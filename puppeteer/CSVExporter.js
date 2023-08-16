const HCCrawler = require("headless-chrome-crawler");
const CSVExporter = require("headless-chrome-crawler/exporter/csv");

const FILE = "./tmp/result.csv";

const exporter = new CSVExporter({
  file: FILE,
  fields: ["response.url", "response.status", "links.length"],
  separator: "\t",
});

(async () => {
  const crawler = await HCCrawler.launch({
    maxDepth: 2,
    exporter,
  });
  await crawler.queue(
    "https://www.taiwanlottery.com.tw/lotto/Lotto649/history.aspx"
  );
  await crawler.onIdle();
  await crawler.close();
})();
