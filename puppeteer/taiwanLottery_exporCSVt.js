const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./archived/taiwanLottery.csv";

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false }); // 使用有界面的 Chrome，以便觀察操作
    const page = await browser.newPage();

    const startIssue = 103000001;
    const endIssue = 110000000; // You can adjust this range as needed

    const results = [];

    const url = `https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx`;
    await page.goto(url);
    console.log("page.goto(url);");

    // 等待元素出現並填寫表單
    await page.waitForSelector("#Lotto649Control_history_txtNO");
    await page.type("#Lotto649Control_history_txtNO", startIssue.toString());

    // 點擊提交按鈕
    await page.click("#Lotto649Control_history_btnSubmit");
    console.log("click");

    // 等待一段時間，讓網頁加載完全
    await page.waitForTimeout(5000);

    const data = await page.evaluate(() => {
      const test = document.getElementById(
        "Lotto649Control_history_dlQuery_L649_DrawTerm_0"
      ).textContent;
      return test;
    });

    console.log(`Test data result: ${data}`);

    await browser.close();

    // Write the data to CSV file
    const csvStream = csv.format({
      headers: ["期別", "開獎日", "頭獎", "獎金總額", "獎號", "特別號"],
    });
    const writableStream = fs.createWriteStream(FILE, "utf-8");

    csvStream.pipe(writableStream);

    csvStream.write(data);

    csvStream.end();

    console.log("History data has been saved to", FILE);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
