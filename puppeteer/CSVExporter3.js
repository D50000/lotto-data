const puppeteer = require("puppeteer");
const fs = require("fs");

const FILE = "./tmp/result.csv"; // CSV need the header label.

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://tw.news.yahoo.com/");

  // 選取元素
  const imageElements = await page.evaluate(() => {
    const elements = document.getElementsByClassName("Pos(a) W(100%) H(100%)");
    return Array.from(elements).map((element) => element.getAttribute("src"));
  });

  // 將選取的元素資料寫入 CSV 檔案
  const csvData = imageElements.map((image) => `"${image}"`).join("\n");
  fs.writeFileSync(FILE, csvData, "utf-8");

  await browser.close();
})();
