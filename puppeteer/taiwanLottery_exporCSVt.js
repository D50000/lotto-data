const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("fast-csv");

const FILE = "./tmp/taiwanLottery.csv";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const startIssue = 103000001;
  const endIssue = 110000000; // You can adjust this range as needed

  const results = [];

  for (let issue = startIssue; issue <= endIssue; issue++) {
    const url = `https://www.taiwanlottery.com.tw/Lotto/Lotto649/history.aspx?Lotto649Control_history1$ddlLotto649Control_history1=0&Lotto649Control_history1$chk=radNO&Lotto649Control_history1$txtNO=${issue}`;

    await page.goto(url);

    const data = await page.evaluate(() => {
      const rowData = Array.from(document.querySelectorAll(".tableFull tr"))
        .slice(1)
        .map((row) => {
          const columns = Array.from(row.querySelectorAll("td")).map((td) =>
            td.innerText.trim()
          );
          return columns;
        });

      return rowData;
    });

    if (data.length > 0) {
      results.push(data[0]);
      console.log(`Scraped issue ${issue}`);
    }
  }

  await browser.close();

  // Write the data to CSV file
  const csvStream = csv.format({
    headers: ["期別", "開獎日", "頭獎", "獎金總額", "獎號", "特別號"],
  });
  const writableStream = fs.createWriteStream(FILE, "utf-8");

  csvStream.pipe(writableStream);

  results.forEach((result) => {
    csvStream.write(result);
  });

  csvStream.end();

  console.log("Data has been saved to", FILE);
})();
