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

- How to use:
  1. Setup **startIssue** & **endIssue** and output file path.
  2. Use **node** to run the script.
- **yahooNewsHeadlines_exportCSV**:
  Crawling **Yahoo News** headlines' photos and titles.Then save it into csv files.
- **taiwanLottery112_exportCSV**: (deprecated)
  This domain has the anti-crawler detector. Need to go through it.
  - `const browser = await puppeteer.launch({ headless: false });`
  - Simulate and mimic human behavior.(ex: **scroll**, **wait**, **fill up** input box)
  - Every query need to wait **10s** to perfectly avoid _crawler blocker_. (ps:Just run the script once per hour)

### TODO:

**taiwanLottery**

- Error handling: crawler crash, data missing, log history.
- Sometime it still crash when executing, maybe server detect the crawler.
- 112y record data just supply to _no:112000116_. (Website update no more history query, just provide download pdf result. Need to manually maintain 112/12 result.)

**General**

- Complete the guideline.
- "News crawler" example need to supporter detecting the infinity scroll then crawl the element data.
