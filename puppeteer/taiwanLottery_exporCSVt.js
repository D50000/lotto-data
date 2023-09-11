const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./archived/taiwanLottery.csv";

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true }); // 使用 Headless Chrome
    const page = await browser.newPage();

    const startIssue = 103000001;
    const endIssue = 110000000; // You can adjust this range as needed

    const results = [];

    const url = `https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx`;
    await page.goto(url);
    console.log("page.goto(url);");

    const data = await page.evaluate(() => {
      // Setup query historyNo.
      const queryInputBox = document.getElementById(
        "Lotto649Control_history_txtNO"
      );
      queryInputBox.value = startIssue;

      // Submit for query.
      const submitBtn = document.getElementById(
        "Lotto649Control_history_btnSubmit"
      );
      submitBtn.click();
      console.log("click");

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
