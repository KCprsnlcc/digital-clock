const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Open our HTML file
  await page.goto(`file://${path.resolve(__dirname, 'digital-clock.html')}`, {
    waitUntil: 'networkidle0'
  });
  
  // Set viewport to match the container size
  await page.setViewport({
    width: 512,
    height: 512,
    deviceScaleFactor: 1
  });
  
  // Take a screenshot
  const screenshotBuffer = await page.screenshot();
  
  // Save as favicon.ico
  fs.writeFileSync(path.resolve(__dirname, '..', 'favicon.ico'), screenshotBuffer);
  
  await browser.close();
  console.log('Favicon generated successfully!');
}

generateFavicon().catch(console.error); 