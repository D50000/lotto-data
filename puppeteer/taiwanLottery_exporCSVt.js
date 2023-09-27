const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./archived/taiwanLottery_107.csv";

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false }); // 使用有界面的 Chrome，以便觀察操作
    const page = await browser.newPage();
    // Setup
    const startIssue = 107000001; 
    const endIssue = 107000108; // Adjust this range as needed.
    const url = `https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx`;

    // Write the data to CSV file
    const csvStream = csv.format({
      // 期別 Lotto649Control_history_dlQuery_L649_DrawTerm_0
      // 開獎日 Lotto649Control_history1_dlQuery_ctl00_L649_DDate
      // 頭獎 Lotto649Control_history_dlQuery_L649_CategA4_0
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
    csvStream.pipe(writableStream); // 將CSV寫入流綁定到可寫流 and formate the header.

    for (let issue = startIssue; issue <= endIssue; issue++) {
      await page.goto(url);
      console.info(`===== Start GoTo: ${url} =====`);

      // 等待元素出現並填寫表單
      await page.waitForSelector("#Lotto649Control_history_txtNO");
      await page.type("#Lotto649Control_history_txtNO", issue.toString());

      // 點擊提交按鈕
      await page.click("#Lotto649Control_history_btnSubmit");
      console.info("submit_click");

      // Wait for the element to be visible
      await page.waitFor(
        () =>
          !!document.querySelector(
            // 等該期資料render完成
            "#Lotto649Control_history_dlQuery_L649_DrawTerm_0"
          )
      );
      // Wait 10s more to avoid 'crawler blocker'.
      setTimeout(() => {
        console.log("Waited for 10 seconds");
      }, 10000); // 10秒

      const data = await page.evaluate(() => {
        const term = document.getElementById(
          // 期別
          "Lotto649Control_history_dlQuery_L649_DrawTerm_0"
        ).textContent;

        const date = document
          .querySelector(
            // 開獎日
            "#Lotto649Control_history1_dlQuery_ctl00_L649_DDate"
          )
          .textContent.replace(/[\n\s]/g, ""); // 資料有雜質

        const firstPrize = document.getElementById(
          // 頭獎
          "Lotto649Control_history_dlQuery_L649_CategA4_0"
        ).textContent;

        const totalPrize = document.getElementById(
          // 獎金總額
          "Lotto649Control_history_dlQuery_Total_0"
        ).textContent;

        const numbers = [];
        for (let i = 1; i <= 6; i++) {
          const number = document.getElementById(
            // 獎號
            `Lotto649Control_history_dlQuery_No${i}_0`
          ).textContent;
          numbers.push(number);
        }

        const specialNumber = document.getElementById(
          // 特別號
          "Lotto649Control_history_dlQuery_SNo_0"
        ).textContent;

        return [
          term,
          date,
          firstPrize,
          totalPrize,
          numbers.toString(),
          specialNumber,
        ];
      });

      console.info(`Data_result: ${data}`);
      csvStream.write(data);
    }

    csvStream.end();
    await browser.close();
    console.log("History data has been saved to", FILE);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
