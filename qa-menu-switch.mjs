import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const result={checks:[],positions:[],errors:[]};
const base='http://127.0.0.1:4185';
try{
 const page=await browser.newPage();page.on('pageerror',e=>result.errors.push(e.message));
 const waitShop=slug=>page.waitForFunction(slug=>document.querySelector('.menu-layout').dataset.location===slug,{},slug);
 for(const width of [390,1440]){
  await page.setViewport({width,height:900});await page.goto(base+'/menu/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>{document.querySelector('#menu-browse').scrollIntoView({behavior:'instant'});window.originalDocument=document;window.originalHero=document.querySelector('.menu-hero');window.originalNav=document.querySelector('.menu-location-switch');window.positions=[];window.monitor=true;const record=()=>{positions.push(scrollY);if(monitor)requestAnimationFrame(record)};requestAnimationFrame(record)});
  const start=await page.evaluate(()=>scrollY);
  await page.click('.menu-location-switch a[href^="/menu/wall-street/"]');await waitShop('wall-street');
  await new Promise(r=>setTimeout(r,500));
  const state=await page.evaluate(()=>({sameDocument:document===originalDocument,sameHero:document.querySelector('.menu-hero')===originalHero,sameNav:document.querySelector('.menu-location-switch')===originalNav,min:Math.min(...positions),max:Math.max(...positions),end:scrollY,title:document.title}));
  assert.ok(state.sameDocument&&state.sameHero&&state.sameNav);assert.ok(Math.abs(state.min-start)<=2&&Math.abs(state.max-start)<=2,JSON.stringify({width,start,...state}));
  assert.match(state.title,/Wall Street/);result.positions.push({width,start,...state});
  await page.click('.menu-location-switch a[href="/menu/#menu-browse"]');await waitShop('flushing');
  await page.evaluate(()=>history.back());await waitShop('wall-street');
  await page.evaluate(()=>history.forward());await waitShop('flushing');
  assert.ok(await page.evaluate(()=>document===originalDocument));
  await page.click('.menu-location-switch a[href^="/menu/wall-street/"]');await waitShop('wall-street');
  await page.type('#menu-search','芒果');await page.click('.menu-card:not([hidden]) .product-details>summary');
  assert.ok(await page.$eval('.menu-dialog',e=>e.open));assert.match(await page.$eval('.menu-dialog .button',e=>e.href),/44491$/);
  await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>document.activeElement.matches('.product-details>summary')));
  await page.evaluate(()=>{monitor=false});
 }
 result.checks.push('Normal-motion mobile and desktop: no document reload, hero/nav replacement or scroll jump; Back/Forward, search and modal remain correct');
 await page.goto(base+'/menu/',{waitUntil:'networkidle0'});
 let fail=true,delay=false;
 await page.setRequestInterception(true);
 page.on('request',async request=>{
  if(request.resourceType()==='fetch'&&request.url().includes('/menu/wall-street/')){
   if(fail){await request.respond({status:503,body:'Temporary failure'});return;}
   if(delay)await new Promise(r=>setTimeout(r,450));
  }
  await request.continue();
 });
 await page.click('.menu-location-switch a[href^="/menu/wall-street/"]');
 await page.waitForSelector('.menu-switch-status.has-error');assert.equal(await page.$eval('.menu-layout',e=>e.dataset.location),'flushing');assert.equal(new URL(page.url()).pathname,'/menu/');
 fail=false;delay=true;
 await page.click('.menu-location-switch a[href^="/menu/wall-street/"]');
 await page.click('.menu-location-switch a[href="/menu/#menu-browse"]');
 await new Promise(r=>setTimeout(r,850));assert.equal(await page.$eval('.menu-layout',e=>e.dataset.location),'flushing');
 await page.click('.menu-location-switch a[href^="/menu/wall-street/"]');await waitShop('wall-street');
 assert.equal(await page.$$eval('.menu-card',e=>e.length),83);
 result.checks.push('Failed fetch retains current menu and URL; retry works; rapid reverse selection cannot be overwritten by a stale response');
 assert.deepEqual(result.errors,[]);result.passed=true;
}finally{await browser.close();await writeFile('qa/menu/switch-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
