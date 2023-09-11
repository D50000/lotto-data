const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./tmp/taiwanLottery.csv";

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const startIssue = 103000001;
    const endIssue = 110000000; // You can adjust this range as needed

    const results = [];

    const url = `https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx`;
    await page.goto(url);
    console.log("page.goto(url);");

    // Wait for the input box to appear and set its value
    await page.waitForSelector("#Lotto649Control_history_txtNO");
    await page.type("#Lotto649Control_history_txtNO", startIssue.toString());

    // Wait for the submit button and click it
    await page.waitForSelector("#Lotto649Control_history_btnSubmit");
    await page.click("#Lotto649Control_history_btnSubmit");
    console.log("click");

    // Wait for the element you want to extract data from
    await page.waitForSelector(
      "#Lotto649Control_history_dlQuery_L649_DrawTerm_0"
    );

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

    // results.forEach((result) => {
    //   csvStream.write(result);
    // });
    csvStream.write(data);

    csvStream.end();

    console.log("History data has been saved to", FILE);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
