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

### TODO:

**taiwanLottery**

- loop the start ~ end data No for crawler.
- Error handling: crawler crash, data missing, log history.

**General**

- Complete the guideline.
- "News crawler" example need to supporter detecting the infinity scroll then crawl the element data.
