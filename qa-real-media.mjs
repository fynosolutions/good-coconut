import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const base=process.env.QA_BASE||'http://127.0.0.1:4192';
const browser=await puppeteer.launch({executablePath:process.env.QA_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const out='qa/real-media';
await mkdir(out,{recursive:true});
const report={viewports:[],errors:[],media:[],checks:[]};
try{
 const page=await browser.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('response',r=>{if(r.url().endsWith('.mp4'))report.media.push({status:r.status(),range:r.headers()['content-range'],type:r.headers()['content-type']});});
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const width of [320,390,768,1024,1440]){
  await page.setViewport({width,height:900});
  await page.goto(base,{waitUntil:'networkidle0'});
  await page.evaluate(async()=>{
   await document.fonts.ready;
   await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));
  });
  const facts=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth-innerWidth,
   sections:[...document.querySelector('main').children].map(e=>e.className),
   heroPhotoTop:document.querySelector('.hero-photo').getBoundingClientRect().top,
   brokenImages:[...document.images].filter(i=>i.getAttribute('src')&&(!i.complete||!i.naturalWidth)).map(i=>i.src),
   newPhotos:[...new Set([...document.images].map(i=>i.getAttribute('src')).filter(s=>s?.includes('/moments/')))],
   video:{count:document.querySelectorAll('video').length,preload:document.querySelector('video').preload,autoplay:document.querySelector('video').autoplay,controls:document.querySelector('video').controls},
   albumOpen:document.querySelector('.scrap-album').open
  }));
  assert.equal(facts.overflow,0);assert.deepEqual(facts.brokenImages,[]);
  assert(facts.sections[1].includes('favorites'));assert(facts.sections[2].includes('story'));
  assert.equal(facts.newPhotos.length,10);assert.equal(facts.video.count,1);
  assert.equal(facts.video.preload,'none');assert.equal(facts.video.autoplay,false);assert.equal(facts.video.controls,true);
  assert.equal(facts.albumOpen,false);
  if(width<=390)assert(facts.heroPhotoTop<430,`Mobile product appears too late: ${facts.heroPhotoTop}`);
  report.viewports.push({width,...facts});
  if([390,1440].includes(width)){
   await page.screenshot({path:`${out}/home-${width}.png`});
   await page.$eval('#favorites',e=>e.scrollIntoView({behavior:'instant'}));
   await page.screenshot({path:`${out}/products-${width}.png`});
   await page.$eval('.story',e=>e.scrollIntoView({behavior:'instant'}));
   await page.screenshot({path:`${out}/story-${width}.png`});
   await page.$eval('#gallery',e=>e.scrollIntoView({behavior:'instant'}));
   await page.screenshot({path:`${out}/gallery-${width}.png`});
  }
 }
 assert.equal(report.media.length,0,'Video must not download before playback');
 report.checks.push('No video download before visitor playback');
 // The native player must actually decode, play and seek, not merely expose a button.
 await page.setViewport({width:390,height:844});
 await page.$eval('video',v=>v.scrollIntoView({behavior:'instant',block:'center'}));
 await page.$eval('video',async v=>{await v.play();});
 await page.waitForFunction(()=>document.querySelector('video').currentTime>1,{timeout:20000});
 await page.$eval('video',v=>{v.pause();v.currentTime=25;});
 await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.seeking&&v.readyState>=2&&Math.abs(v.currentTime-25)<.2;});
 report.playback=await page.$eval('video',v=>({duration:v.duration,currentTime:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error}));
 assert(report.playback.duration>36&&report.playback.duration<37);assert.equal(report.playback.error,null);
 await page.screenshot({path:`${out}/video-playing-390.png`});
 // The optional album works with mouse and keyboard, and its photos enlarge.
 await page.$eval('.scrap-album summary',e=>e.scrollIntoView({behavior:'instant',block:'center'}));
 await page.click('.scrap-album summary');
 await page.waitForFunction(()=>document.querySelector('.scrap-album').open);
 await page.click('.scrap-album [data-gallery-photo]');
 await page.waitForSelector('.scrap-lightbox[open]');
 await page.waitForFunction(()=>document.querySelector('.scrap-lightbox img').naturalWidth>0);
 await page.keyboard.press('Escape');
 assert(await page.evaluate(()=>document.activeElement.closest('.scrap-album')!==null));
 await page.$eval('.scrap-album summary',e=>e.focus());await page.keyboard.press('Enter');
 assert.equal(await page.$eval('.scrap-album',e=>e.open),false);
 report.checks.push('Album opens; new photo enlarges; Escape returns focus; Enter collapses album');
 // Verify a useful media-error state using an isolated page and a failed media request.
 const failed=await browser.newPage();
 await failed.setRequestInterception(true);
 failed.on('request',request=>request.url().endsWith('.mp4')?request.abort():request.continue());
 await failed.goto(base,{waitUntil:'load'});
 await failed.$eval('video',v=>v.load());
 await failed.waitForFunction(()=>!document.querySelector('.scrap-video-error').hidden);
 report.checks.push('Failed video request exposes recovery link');await failed.close();
 await page.setJavaScriptEnabled(false);await page.goto(base,{waitUntil:'load'});
 await page.click('.scrap-album summary');
 assert.equal(await page.$eval('.scrap-album',e=>e.open),true);
 assert.equal(await page.$eval('video',e=>e.controls),true);
 report.checks.push('Album and native video remain available without JavaScript');
 assert.deepEqual(report.errors,[]);report.passed=true;
}finally{
 await writeFile(`${out}/results.json`,JSON.stringify(report,null,2));await browser.close();
}
console.log(JSON.stringify(report,null,2));
