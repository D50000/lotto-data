const HCCrawler = require("headless-chrome-crawler");
const CSVExporter = require("headless-chrome-crawler/exporter/csv");

const FILE = "./tmp/taiwanLottery.csv";

const exporter = new CSVExporter({
  file: FILE,
  // Crawler Target and it will be the csv columns.
  fields: ["期別", "開獎日", "頭獎", "獎金總額", "獎號", "特別號"],
  separator: "\t",
});

(async () => {
  const crawler = await HCCrawler.launch({
    maxDepth: 2,
    exporter,
  });
  try {
    await crawler.queue(
      "https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx"
    );
    await crawler.onIdle();
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await crawler.close();
  }
})();
