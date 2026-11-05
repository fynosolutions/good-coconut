import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
const base=process.env.QA_BASE||'http://127.0.0.1:4192';
const out='qa/gallery-autoplay';
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={viewports:[],playback:[],errors:[]};
try{
 const page=await browser.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 for(const width of [320,390,768,1024,1440]){
  await page.setViewport({width,height:900});
  await page.goto(base,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  const facts=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,
   videos:[...document.querySelectorAll('#gallery video')].map(v=>({autoplay:v.autoplay,muted:v.muted,loop:v.loop,inline:v.playsInline,controls:v.controls,fit:getComputedStyle(v).objectFit})),
   rows:[...document.querySelectorAll('.scrap-extra-row')].map(row=>row.querySelectorAll('.scrap-piece').length)}));
  assert.equal(facts.overflow,0);assert.equal(facts.videos.length,8);assert.deepEqual(facts.rows,[4,4]);
  facts.videos.forEach(v=>assert.deepEqual(v,{autoplay:true,muted:true,loop:true,inline:true,controls:false,fit:'contain'}));
  // No click and no test-issued play(): scrolling alone must start every video.
  if([390,1440].includes(width)){
   for(let i=0;i<8;i++){
    await page.evaluate(i=>document.querySelectorAll('#gallery video')[i].scrollIntoView({behavior:'instant',block:'center'}),i);
    await page.waitForFunction(i=>{const v=document.querySelectorAll('#gallery video')[i];return !v.paused&&v.currentTime>.1&&v.videoWidth>0;},{timeout:20000},i);
    const state=await page.evaluate(i=>{const v=document.querySelectorAll('#gallery video')[i];return {src:v.currentSrc,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error};},i);
    await page.waitForFunction((i,time)=>document.querySelectorAll('#gallery video')[i].currentTime>time+.15,{},i,state.time);
    assert.equal(state.error,null);report.playback.push({viewport:width,...state});
   }
   const height=await page.$eval('#gallery',e=>Math.ceil(e.getBoundingClientRect().height)+160);
   await page.setViewport({width,height});
   await page.$eval('#gallery',e=>e.scrollIntoView({behavior:'instant'}));
   await (await page.$('#gallery')).screenshot({path:`${out}/gallery-${width}.png`});
   await page.setViewport({width,height:900});
  }
  report.viewports.push({width,...facts});
 }
 // Confirm loops continue and a film resumes after leaving the viewport.
 await page.$eval('video',v=>v.scrollIntoView({behavior:'instant',block:'center'}));
 await page.waitForFunction(()=>!document.querySelector('video').paused);
 await page.$eval('video',v=>{v.currentTime=v.duration-.3;});
 await page.waitForFunction(()=>{const v=document.querySelector('video');return v.currentTime<2&&!v.paused;},{timeout:10000});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForFunction(()=>[...document.querySelectorAll('#gallery video')].every(v=>v.paused));
 await page.$eval('video',v=>v.scrollIntoView({behavior:'instant',block:'center'}));
 await page.waitForFunction(()=>!document.querySelector('video').paused);
 const failed=await browser.newPage();await failed.setRequestInterception(true);
 failed.on('request',r=>r.url().endsWith('.mp4')?r.abort():r.continue());
 await failed.goto(base,{waitUntil:'load'});
 await failed.$eval('video',v=>v.scrollIntoView({behavior:'instant',block:'center'}));
 await failed.waitForFunction(()=>!document.querySelector('.scrap-video-error').hidden);
 await failed.close();
 assert.deepEqual(report.errors,[]);report.passed=true;
}finally{await writeFile(`${out}/results.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({passed:report.passed,widths:report.viewports.map(v=>v.width),automaticPlaybackChecks:report.playback.length,errors:report.errors}));
