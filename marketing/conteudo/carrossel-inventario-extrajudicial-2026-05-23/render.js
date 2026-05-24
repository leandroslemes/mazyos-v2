const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'carrossel.html');
  await page.goto('file://' + htmlPath);

  // Wait for Google Fonts to load
  await page.waitForTimeout(2500);

  const outDir = path.join(__dirname, 'instagram');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const slides = await page.$$('.slide');
  console.log(`Renderizando ${slides.length} slides...`);

  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const outPath = path.join(outDir, `slide-${num}.png`);
    await slides[i].screenshot({ path: outPath });
    console.log(`  ✓ slide-${num}.png`);
  }

  await browser.close();
  console.log('\nPronto! Slides em: instagram/');
})();
