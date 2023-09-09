const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./tmp/taiwanLottery.csv";

(async () => {
  // TODO: Fix the crashing when load the page.
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const startIssue = 103000001;
    const endIssue = 110000000; // You can adjust this range as needed

    const results = [];

    const url = `https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx`;
    await page.goto(url);

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

      const test = document.getElementById(
        "Lotto649Control_history_dlQuery_L649_DrawTerm_0"
      ).textContent;
      return test;
    });

    console.log(`Test data result: ${data}`);

    await browser.close();

    // Write the data to CSV file
    const csvStream = csv.format({
      // 期別 Lotto649Control_history_dlQuery_L649_DrawTerm_0
      // 開獎日 Lotto649Control_history1_dlQuery_ctl00_L649_DDate
      // 頭獎 Lotto649Control_history_dlQuery_L649_CategA5_0
      // 獎金總額 Lotto649Control_history_dlQuery_Total_0
      // 獎號 Lotto649Control_history_dlQuery_No1_0,
      //     Lotto649Control_history_dlQuery_No2_0
      //     Lotto649Control_history_dlQuery_No3_0
      //     Lotto649Control_history_dlQuery_No4_0
      //     Lotto649Control_history_dlQuery_No5_0
      //     Lotto649Control_history_dlQuery_No6_0
      // 特別號 Lotto649Control_history_dlQuery_SNo_0
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
