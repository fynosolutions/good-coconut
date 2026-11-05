import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const {default:puppeteer}=await import(process.env.QA_PUPPETEER_PATH||'puppeteer-core');
const base=process.env.QA_BASE||'http://127.0.0.1:4192';
const browser=await puppeteer.launch({executablePath:process.env.QA_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const results=[];
await mkdir('qa/critique-update',{recursive:true});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const source=await readFile('gallery.mjs','utf8');
 // Keep the approved original photographs; the three portrait positions now use supplied media.
 const originalPhotos=['/assets/pudding.jpg','/assets/original-about.jpg','/assets/lime.jpg','/assets/gallery-03.webp','/assets/hero.webp','/assets/gallery-06.webp','/assets/gallery-04.webp','/assets/gallery-02.webp','/assets/gallery-05.webp'];
 for(const asset of originalPhotos)assert(source.includes(asset),`Original photo removed: ${asset}`);
 async function ready(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));});}
 for(const width of [320,390,768,1440]){
  await page.setViewport({width,height:900});await page.goto(base,{waitUntil:'networkidle0'});await ready();
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  const facts=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,playIcons:document.querySelectorAll('.scrap-play').length,photos:document.querySelectorAll('[data-gallery-photo]').length,statusSizes:[...document.querySelectorAll('.scrap-video-label')].map(e=>parseFloat(getComputedStyle(e).fontSize)),links:[...document.querySelectorAll('.product-copy a')].map(a=>a.getAttribute('href'))}));
  assert.equal(facts.overflow,0);assert.equal(facts.playIcons,0);assert.equal(facts.photos,18);assert.equal(facts.statusSizes.length,0);
  if(width===390||width===1440){await page.screenshot({path:`qa/critique-update/hero-${width}.png`});await page.$eval('.story',e=>e.scrollIntoView({behavior:'instant'}));await page.screenshot({path:`qa/critique-update/story-${width}.png`});}
  if(width<=800)await page.click('.menu-toggle');
  await page.click('#main-nav a[href="/#gallery"]');
  await page.waitForFunction(()=>location.hash==='#gallery'&&!document.body.classList.contains('menu-open'));
  await page.waitForFunction(()=>document.querySelector('#scrapbook-title').getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom);
  const anchor=await page.evaluate(()=>({heading:document.querySelector('#scrapbook-title').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().bottom}));
  if(width===390||width===1440)await page.screenshot({path:`qa/critique-update/gallery-anchor-${width}.png`});
  results.push({width,...facts,anchor});
 }
 // Follow every homepage product shortcut and ensure the intended category is visible.
 const links=results[0].links.filter(link=>link.includes('#category-'));
 await page.setViewport({width:390,height:844});
 for(const link of links){
  await page.goto(base+link,{waitUntil:'networkidle0'});await ready();
  const target=await page.$(new URL(base+link).hash);assert(target,`Missing category ${link}`);
  const name=await target.$eval('h2',e=>e.textContent);
  const bounds=await target.evaluate(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}));
  assert(bounds.top>=0&&bounds.top<500,`Category not reached: ${link}: ${JSON.stringify(bounds)}`);
  results.push({link,name,bounds});
 }
 // Direct shared Gallery URL, including page loading and fonts.
 await page.goto(base+'/#gallery',{waitUntil:'networkidle0'});await ready();
 const direct=await page.$eval('#scrapbook-title',e=>e.getBoundingClientRect().top);
 assert(direct>=80,`Direct Gallery heading hidden: ${direct}`);
 assert.deepEqual(errors,[]);results.push({directAnchorTop:direct,errors});
 await writeFile('qa/critique-update/results.json',JSON.stringify({passed:true,results},null,2));
 console.log(JSON.stringify({passed:true,viewports:4,categoryLinks:links.length,directAnchorTop:direct,originalGalleryPhotosPreserved:true}));
}finally{await browser.close();}
