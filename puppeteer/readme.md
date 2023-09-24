# Puppeteer

[Puppeteer](https://pptr.dev/category/guides)  
[Github example](https://github.com/puppeteer/puppeteer)

## Installation & Requirement

```javascript
npm i puppeteer

# or using yarn
yarn add puppeteer

# or using pnpm
pnpm i puppeteer
```

## Example-Template

- yahooNewsHeadlines_exportCSV:
  Crawling **Yahoo News** headlines' photos and titles.Then save it into csv files.
- taiwanLottery_exportCSV:
  This domain has the anti-crawler detector. Need to go through it.
  - `const browser = await puppeteer.launch({ headless: false });`
  - Simulate and mimic human behavior.(ex: **scroll**, **wait**, **fill up** input box)
  - Every query need to wait **10s** to perfectly avoid _crawler blocker_. (ps:Just run the script once per hour)
- How to use:
  1. Setup **startIssue** & **endIssue** and output file path.
  2. Use **node** to run the script.

### TODO:

**taiwanLottery**

- Error handling: crawler crash, data missing, log history.
- Sometime it still crash when executing, maybe server detect the crawler.

**General**

- Complete the guideline.
- "News crawler" example need to supporter detecting the infinity scroll then crawl the element data.
