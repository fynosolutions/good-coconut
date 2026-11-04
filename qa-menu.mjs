import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const result={viewports:[],checks:[],errors:[]};
await mkdir('qa/menu',{recursive:true});
try{
 const p=await browser.newPage();p.on('pageerror',e=>result.errors.push(e.message));
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const width of [320,390,768,1024,1440]){
  await p.setViewport({width,height:1000});
  const response=await p.goto('http://127.0.0.1:4185/menu/',{waitUntil:'networkidle0'});assert.equal(response.status(),200);
  await p.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const state=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),cards:document.querySelectorAll('.menu-card').length,categories:document.querySelectorAll('.menu-category').length,soldOut:/sold out/i.test(document.body.innerText)}));
  assert.equal(state.overflow,false);assert.deepEqual(state.broken,[]);assert.equal(state.cards,88);assert.equal(state.categories,11);assert.equal(state.soldOut,false);result.viewports.push(state);
  if([390,1440].includes(width)){
   await p.screenshot({path:`qa/menu/hero-${width}.png`});
   await p.$eval('#menu-browse',e=>e.scrollIntoView({behavior:'instant'}));
   await p.screenshot({path:`qa/menu/catalog-${width}.png`});
  }
 }
 await p.type('#menu-search','芒果');
 assert.ok(await p.$$eval('.menu-card:not([hidden])',els=>els.length>0&&els.length<88));
 await p.click('.menu-card:not([hidden]) .product-details>summary');
 assert.ok(await p.$eval('.menu-dialog',e=>e.open));
 assert.match(await p.$eval('#menu-dialog-title',e=>e.textContent),/Mango/);
 await p.screenshot({path:'qa/menu/details-desktop.png'});
 await p.keyboard.press('Escape');assert.equal(await p.$eval('.menu-dialog',e=>e.open),false);
 assert.ok(await p.evaluate(()=>document.activeElement.matches('.product-details>summary')));
 result.checks.push('Chinese search filters products; product dialog and Escape restore focus');
 await p.click('#clear-menu-search');await p.type('#menu-search','zzzzzz-no-such-drink');
 assert.ok(await p.$eval('.menu-empty',e=>!e.hidden));await p.click('#menu-reset');
 assert.equal(await p.$$eval('.menu-card:not([hidden])',els=>els.length),88);
 await p.type('#menu-search','mango');assert.ok(await p.$$eval('.menu-card:not([hidden])',els=>els.length>0));await p.click('#clear-menu-search');
 result.checks.push('English search, empty state and reset');
 await p.setViewport({width:390,height:844});await p.goto('http://127.0.0.1:4185/');await p.click('.menu-toggle');
 await Promise.all([p.waitForNavigation(),p.click('#main-nav a[href="/menu/"]')]);
 assert.match(p.url(),/\/menu\/$/);assert.equal(await p.$eval('#main-nav a[href="/menu/"]',e=>e.getAttribute('aria-current')),'page');
 await p.$eval('.menu-categories a:nth-child(6)',e=>e.click());
 await new Promise(r=>setTimeout(r,120));
 const y=await p.$eval('.menu-category:nth-of-type(6)',e=>e.getBoundingClientRect().top);assert.ok(y>=190&&y<250,`category anchor top ${y}`);
 await p.click('.menu-category:nth-of-type(6) .product-details>summary');
 assert.ok(await p.$eval('.menu-dialog',e=>e.open));
 assert.equal(await p.$eval('.menu-dialog',e=>e.scrollWidth>e.clientWidth),false);
 await p.screenshot({path:'qa/menu/details-mobile.png'});await p.keyboard.press('Escape');
 result.checks.push('Mobile main navigation, category anchors clear sticky controls, dialog fits');
 const orderLinks=await p.$$eval('.menu-store-order,.menu-outro .button',els=>els.map(e=>e.href));assert.ok(orderLinks.every(url=>url.endsWith('/15247')));
 for(const route of ['/','/online/','/contact-us/']){await p.goto('http://127.0.0.1:4185'+route);assert.ok(await p.$('#main-nav a[href="/menu/"]'));}
 result.checks.push('Shared navigation on all pages and correct Flushing order links');
 await p.setJavaScriptEnabled(false);await p.goto('http://127.0.0.1:4185/menu/');
 assert.equal(await p.$$eval('.menu-card',els=>els.length),88);await p.click('.product-details>summary');assert.ok(await p.$eval('.product-details',e=>e.open));
 result.checks.push('Full menu and expandable product information without JavaScript');
 assert.deepEqual(result.errors,[]);result.passed=true;
}finally{await browser.close();await writeFile('qa/menu/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
