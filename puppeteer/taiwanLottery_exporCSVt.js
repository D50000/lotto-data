const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./archived/taiwanLottery.csv";

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false }); // 使用有界面的 Chrome，以便觀察操作
    const page = await browser.newPage();

    const startIssue = 103000001;
    const endIssue = 103000005; // You can adjust this range as needed

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

    // Wait for the element to be visible
    await page.waitFor(
      () =>
        !!document.querySelector(
          // 等該期資料render完成
          "#Lotto649Control_history_dlQuery_L649_DrawTerm_0"
        )
    );

    const data = await page.evaluate(() => {
      const testElement = document.getElementById(
        "Lotto649Control_history_dlQuery_L649_CategA5_0"
      );

      if (testElement) {
        return testElement.textContent;
      } else {
        return "Element not found";
      }
    });

    console.log(`Test data result: ${data}`);
    const dataArray = [
      ["1", "2", "3", "4", "5", "6"],
      ["11", "22", "33", "44", "55", "66"],
    ]; // TODO: test data
    // dataArray.push(data); // convert the data to array[].
    console.log(`T  ${dataArray}`);

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
    csvStream.pipe(writableStream); // 將CSV寫入流綁定到可寫流 and formate the header.

    dataArray.forEach((data) => {
      csvStream.write(data);
    });

    csvStream.end();

    console.log("History data has been saved to", FILE);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
