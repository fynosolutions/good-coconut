import puppeteer from 'puppeteer-core';
import {createApp} from './server.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
let browser;const results=[];
try{
 browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/online/','/contact-us/']){
  await page.setViewport({width:1440,height:900});await page.goto(base+route,{waitUntil:'load'});
  await page.waitForFunction(()=>document.querySelector('h1').getAnimations().length>0);
  if(route!=='/online/')assert.ok(await page.$eval('[data-entrance="icon"]',e=>e.getAnimations().length>0));
  await page.waitForFunction(()=>document.querySelector('h1').getAnimations().length===0);
  assert.equal(await page.$eval('h1',e=>getComputedStyle(e).opacity),'1');results.push(route+' heading and icon jump in and settle');
 }
 const expected=[['.product-feature:not(.reverse):not(.more)','zoom-in','slide-in'],['.product-feature.reverse','rotate-up-right','soft-zoom'],['.product-feature.more','bounce-up','fade-up']];
 for(const width of [390,1440]){await page.setViewport({width,height:900});
  for(const [selector,headingEffect,bodyEffect]of expected){
   await page.goto(base+'/',{waitUntil:'networkidle0'});
   await page.$eval(selector+' .product-copy',e=>e.scrollIntoView({behavior:'instant',block:'center'}));
   await page.waitForFunction(s=>document.querySelector(s+' h3').getAnimations().length>0,{},selector);
   assert.equal(await page.$eval(selector+' h3',e=>e.dataset.textMotion),headingEffect);
   assert.equal(await page.$eval(selector+' p',e=>e.dataset.textMotion),bodyEffect);
   await page.waitForFunction(s=>document.querySelector(s+' p').getAnimations().length>0,{},selector);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.waitForFunction(s=>document.querySelector(s+' h3').getAnimations().length===0&&document.querySelector(s+' p').getAnimations().length===0,{},selector);
   assert.equal(await page.$eval(selector+' p',e=>getComputedStyle(e).opacity),'1');
  }
 }results.push('three distinct product heading/body combinations animate on desktop and mobile without overflow');
 await page.goto(base+'/',{waitUntil:'networkidle0'});
 await page.$eval('.product-copy',e=>e.scrollIntoView({behavior:'instant',block:'center'}));
 await page.waitForFunction(()=>document.querySelector('.product-copy h3').getAnimations().length>0);
 await page.waitForFunction(()=>document.querySelector('.product-copy h3').getAnimations().length===0);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await new Promise(r=>setTimeout(r,100));
 await page.$eval('.product-copy',e=>e.scrollIntoView({behavior:'instant',block:'center'}));await new Promise(r=>setTimeout(r,150));
 assert.equal(await page.$eval('.product-copy h3',e=>e.getAnimations().length),0);results.push('scroll entrances run once');
 await page.reload({waitUntil:'load'});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.waitForFunction(()=>document.querySelector('h1').getAnimations().length===0);
 await page.reload({waitUntil:'networkidle0'});assert.equal(await page.$eval('h1',e=>e.getAnimations().length),0);assert.equal(await page.$eval('h1',e=>getComputedStyle(e).opacity),'1');results.push('reduced motion cancels current entrances and disables new ones');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await page.setViewport({width:390,height:844});await page.goto(base+'/',{waitUntil:'load'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.setJavaScriptEnabled(false);await page.reload({waitUntil:'networkidle0'});assert.equal(await page.$eval('h1',e=>getComputedStyle(e).opacity),'1');results.push('mobile width and no-JavaScript text visibility');assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,results,errors}));await writeFile('qa/motion-results.json',JSON.stringify({passed:true,results,errors},null,2));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
