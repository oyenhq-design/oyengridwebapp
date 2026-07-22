const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    console.log('Page loaded successfully');
  } catch (e) {
    console.log('Failed to load page:', e);
  }
  await browser.close();
})();
