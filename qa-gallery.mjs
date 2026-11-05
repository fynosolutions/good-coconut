import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
// Normally uses this project's devDependency; a sibling checkout can supply it.
const {default:puppeteer}=await import(process.env.QA_PUPPETEER_PATH||'puppeteer-core');
const browser=await puppeteer.launch({executablePath:process.env.QA_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const base=process.env.QA_BASE||'http://127.0.0.1:4192';
const report={viewports:[],interactions:[],errors:[]};
await mkdir('qa/gallery',{recursive:true});
try{
 const page=await browser.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 for(const width of [320,390,768,820,1024,1440]){
  await page.setViewport({width,height:1000});
  await page.goto(base,{waitUntil:'load'});
  await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.querySelectorAll('#gallery img')){image.loading='eager';await image.decode().catch(()=>{});}});
  await page.$eval('#gallery',el=>el.scrollIntoView({behavior:'instant',block:'start'}));
  const metrics=await page.evaluate(()=>{
   const g=document.querySelector('#gallery'),nav=document.querySelector('.site-header');
   return {overflow:document.documentElement.scrollWidth-innerWidth,brokenImages:[...g.querySelectorAll('img')].filter(e=>e.getAttribute('src')&&(!e.complete||!e.naturalWidth)).length,placeholders:g.querySelectorAll('.scrap-video-label').length,photos:g.querySelectorAll('[data-gallery-photo]').length,extraRows:[...g.querySelectorAll('.scrap-extra-row')].map(e=>e.querySelectorAll('[data-gallery-photo]').length),handwriting:document.fonts.check('500 24px Caveat'),pieces:[...g.querySelectorAll('.scrap-piece')].map(e=>({class:e.className,width:Math.round(e.getBoundingClientRect().width)})),headerOverflow:nav.scrollWidth>nav.clientWidth};
  });
  assert.ok(metrics.overflow<=1,`Page overflows at ${width}px`);
  assert.equal(metrics.brokenImages,0,`Broken Gallery images at ${width}px`);
  assert.equal(metrics.placeholders,0);assert.equal(metrics.photos,11);assert.deepEqual(metrics.extraRows,[0,3]);assert.equal(metrics.handwriting,true);
  assert.equal(metrics.headerOverflow,false,`Header overflows at ${width}px`);
  report.viewports.push({width,...metrics});
  if([390,1024,1440].includes(width)){
   // Keep the whole section inside the viewport while capturing, so the sticky
   // page header cannot be composited across the middle of a tall element shot.
   const captureHeight=await page.$eval('#gallery',e=>Math.ceil(e.getBoundingClientRect().height)+250);
   await page.setViewport({width,height:captureHeight});
   await page.$eval('#gallery',el=>el.scrollIntoView({behavior:'instant',block:'start'}));
   await page.evaluate(()=>new Promise(requestAnimationFrame));
   await(await page.$('#gallery')).screenshot({path:`qa/gallery/${width===1440?'desktop':width===390?'mobile':'tablet'}.png`});
   await(await page.$('.scrapbook-continuation')).screenshot({path:`qa/gallery/extra-rows-${width}.png`});
   await page.setViewport({width,height:1000});
  }
 }
 // Gallery navigation reaches the new section and preserves the old ribbon.
 await page.click('#main-nav a[href="/#gallery"]');
 await page.waitForFunction(()=>location.hash==='#gallery');
 assert.equal(await page.$eval('.photo-strip',e=>Boolean(e)),true);
 report.interactions.push('Gallery navigation and original photo ribbon');
 // Check the primary photo interaction, native dialog focus trap and Escape.
 const photo=await page.$('[data-gallery-photo]');
 await photo.click();
 await page.waitForSelector('.scrap-lightbox[open]');
 assert.equal(await page.$eval('.scrap-lightbox img',e=>e.alt.length>0),true);
  await page.$eval('#main-nav a',e=>e.focus());
 assert.equal(await page.evaluate(()=>document.activeElement.closest('dialog')!==null),true);
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>!document.querySelector('.scrap-lightbox').open);
 assert.equal(await page.evaluate(()=>document.activeElement.matches('[data-gallery-photo]')),true);
 assert.equal(await page.$eval('body',e=>e.classList.contains('scrap-photo-open')),false);
 report.interactions.push('Photo opens; background cannot receive focus; Escape closes; focus returns');
 // An actual photo from each new row must open, including the bottom of the wall.
 for(const row of await page.$$('.scrap-extra-row')){
  const link=await row.$('[data-gallery-photo]');
  if(!link)continue;
  await link.click();await page.waitForSelector('.scrap-lightbox[open]');
  assert.equal(await page.$eval('.scrap-lightbox img',e=>e.complete&&e.naturalWidth>0),true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('.scrap-lightbox').open);
 }
 report.interactions.push('Photos in both added rows open in the lightbox');
 // Mobile navigation closes after choosing Gallery.
 await page.setViewport({width:390,height:844});await page.goto(base);
 await page.click('.menu-toggle');await page.click('#main-nav a[href="/#gallery"]');
 assert.equal(await page.$eval('.menu-toggle',e=>e.getAttribute('aria-expanded')),'false');
 assert.equal(await page.$eval('body',e=>e.classList.contains('menu-open')),false);
 report.interactions.push('Mobile Gallery menu link closes navigation');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload();
 assert.equal(await page.$eval('.scrap-piece',e=>getComputedStyle(e).transitionDuration),'0s');
 report.interactions.push('Reduced motion keeps collage static');
 // Progressive fallback remains useful without the client script.
 await page.setJavaScriptEnabled(false);await page.goto(base);
 assert.equal(await page.$eval('[data-gallery-photo]',e=>e.href.endsWith('/assets/pudding.jpg')),true);
 assert.equal(await page.$eval('#gallery',e=>getComputedStyle(e).display!=='none'),true);
 report.interactions.push('No-JavaScript photos retain source-image links and visible content');
 assert.deepEqual(report.errors,[]);
 report.passed=true;
}finally{await writeFile('qa/gallery/results.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify(report,null,2));
