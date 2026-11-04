import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';

const menus=await Promise.all(['menu-content.json','menu-wall-street.json'].map(async file=>JSON.parse(await readFile(file,'utf8'))));
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const result={checks:[],viewports:[],errors:[]};
const origin='http://127.0.0.1:4185';
const shops=[{route:'/menu/',slug:'flushing',name:'Flushing',cards:88,categories:11},{route:'/menu/wall-street/',slug:'wall-street',name:'Wall Street',cards:83,categories:12}];
await mkdir('qa/menu',{recursive:true});
try{
 const page=await browser.newPage();page.on('pageerror',error=>result.errors.push(error.message));
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const [index,shop] of shops.entries()){
  for(const width of [320,390,768,1440]){
   await page.setViewport({width,height:1000});
   const response=await page.goto(origin+shop.route,{waitUntil:'networkidle0'});assert.equal(response.status(),200);
   await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   const state=await page.evaluate(()=>({width:innerWidth,location:document.querySelector('.menu-layout').dataset.location,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),cards:document.querySelectorAll('.menu-card').length,categories:document.querySelectorAll('.menu-category').length,squares:[...document.querySelectorAll('.menu-card-photo')].every(e=>Math.abs(e.clientHeight-e.clientWidth)<2)}));
   assert.equal(state.location,shop.slug);assert.equal(state.overflow,false);assert.deepEqual(state.broken,[]);assert.equal(state.cards,shop.cards);assert.equal(state.categories,shop.categories);assert.equal(state.squares,true);result.viewports.push(state);
   assert.equal(await page.$eval('.menu-location-switch a[aria-current]',e=>e.pathname),shop.route);
   assert.equal(await page.$('.menu-sidebar .button'),null);
   const links=await page.$$eval('.menu-store-order,.menu-outro .button',els=>els.map(e=>e.href));assert.ok(links.every(url=>url===menus[index].source_url));
   if([390,1440].includes(width)){await page.$eval('#menu-browse',e=>e.scrollIntoView({behavior:'instant'}));await page.screenshot({path:`qa/menu/locations-${shop.slug}-${width}.png`});}
  }
  const actual=await page.$$eval('.menu-card',cards=>cards.map(card=>({id:card.dataset.productId,name:card.querySelector('h3').textContent.toLowerCase(),zh:card.querySelector('.menu-name-zh').textContent,price:card.querySelector('.menu-price').textContent})));
  const expected=menus[index].categories.flatMap(c=>c.items).map(i=>({id:i.id,name:i.name_en.toLowerCase(),zh:i.name_zh,price:i.points?`${i.points} pts`:i.price.display}));
  assert.deepEqual(actual,expected);
  await page.type('#menu-search','芒果');
  const filtered=await page.$$eval('.menu-card:not([hidden])',els=>els.length);assert.ok(filtered>0&&filtered<shop.cards);
  await page.click('.menu-card:not([hidden]) .product-details>summary');assert.ok(await page.$eval('.menu-dialog',e=>e.open));
  assert.equal(await page.$eval('.menu-dialog .button',e=>e.href),menus[index].source_url);
  await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>document.activeElement.matches('.product-details>summary')));
  await page.click('#clear-menu-search');await page.type('#menu-search','zzzzzz-missing');assert.ok(await page.$eval('.menu-empty',e=>!e.hidden));await page.click('#menu-reset');
  assert.equal(await page.$$eval('.menu-card:not([hidden])',els=>els.length),shop.cards);
  result.checks.push(`${shop.name}: all rendered names/prices match its data; search/reset, modal focus and ordering match location`);
 }
 await page.goto(origin+'/menu/');await page.type('#menu-search','椰子海洋');
 await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.click('.menu-location-switch a[href^="/menu/wall-street/"]')]);
 assert.match(page.url(),/\/menu\/wall-street\/#menu-browse$/);assert.equal(await page.$eval('#menu-search',e=>e.value),'');
 assert.equal(await page.$$eval('.menu-card',els=>els.length),83);
 await page.reload({waitUntil:'networkidle0'});assert.equal(await page.$eval('.menu-layout',e=>e.dataset.location),'wall-street');
 await page.goBack({waitUntil:'networkidle0'});
 await page.waitForFunction(()=>document.querySelector('.menu-layout').dataset.location==='flushing');
 result.checks.push('Location switch clears the previous search; direct URL, refresh and browser Back retain the correct menu');
 await page.setJavaScriptEnabled(false);await page.goto(origin+'/menu/');
 await Promise.all([page.waitForNavigation(),page.click('.menu-location-switch a[href^="/menu/wall-street/"]')]);
 assert.equal(await page.$$eval('.menu-card',els=>els.length),83);await page.click('.product-details>summary');assert.ok(await page.$eval('.product-details',e=>e.open));
 await Promise.all([page.waitForNavigation(),page.click('.menu-location-switch a[href="/menu/#menu-browse"]')]);assert.equal(await page.$$eval('.menu-card',els=>els.length),88);
 result.checks.push('Both location menus, switching and product details work without JavaScript');
 assert.deepEqual(result.errors,[]);result.passed=true;
}finally{await browser.close();await writeFile('qa/menu/locations-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));}
