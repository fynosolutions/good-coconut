import puppeteer from 'puppeteer-core';
import {createApp} from './server.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=createApp({env:{}}); await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const result={pages:[],errors:[]};
try {
 await mkdir('qa/updated',{recursive:true});
 const p=await browser.newPage();p.on('pageerror',e=>result.errors.push(e.message));
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const route of ['/','/online/','/contact-us/']) for(const width of [320,390,768,1024,1440]) {
 await p.setViewport({width,height:900});await p.goto(`http://127.0.0.1:${server.address().port}${route}`,{waitUntil:'networkidle0'});
 await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 result.pages.push({route,width,...await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),heroPhoto:document.querySelector('.hero-photo')?.getBoundingClientRect().toJSON(),logo:document.querySelector('.hero-brand-mark')?.getBoundingClientRect().toJSON()}))});
 assert.equal(result.pages.at(-1).overflow,false);assert.deepEqual(result.pages.at(-1).broken,[]);
 if(width<=768)assert.equal(await p.$eval('.mobile-order',e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right<=innerWidth}),true);
 if(route==='/'&&width<=560)assert.equal(await p.evaluate(()=>document.querySelector('.story-copy>.sun-icon').getBoundingClientRect().top>document.querySelector('.story-copy p').getBoundingClientRect().bottom),true,'sun stays below text');
 if(route==='/online/'){const links=await p.$$eval('.order-shortcuts a',es=>es.map(e=>({url:e.href,bottom:e.getBoundingClientRect().bottom})));assert.match(links[0].url,/15247$/);assert.match(links[1].url,/44491$/);assert.ok(links.every(e=>e.bottom<700));}
 if([390,1440].includes(width))await p.screenshot({path:`qa/updated/${route.replaceAll('/','')||'home'}-${width}.png`,fullPage:true});
 }
 await p.setViewport({width:390,height:844});await p.click('.menu-toggle');result.menuOpen=await p.$eval('.menu-toggle',e=>e.getAttribute('aria-expanded'));await p.keyboard.press('Escape');result.menuEscape=await p.evaluate(()=>document.activeElement.className);
 assert.ok(await p.$('#contact-form'));assert.equal(await p.$eval('#message',e=>e.required),true);await p.type('#email','qa@example.com');assert.equal(await p.$eval('form',e=>e.checkValidity()),false);await p.type('#message','Local QA only.');await p.click('button[type=submit]');await p.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('not been sent'));assert.equal(await p.$eval('#message',e=>e.value),'Local QA only.');
 await p.click('.menu-toggle');await p.$eval('#main-nav a:last-child',e=>e.focus());await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.className),'button mobile-order');await p.keyboard.press('Escape');
 await p.setJavaScriptEnabled(false);await p.reload({waitUntil:'networkidle0'});assert.ok(await p.$eval('#main-nav',e=>e.getBoundingClientRect().height)>0);assert.equal(await p.$eval('#contact-form',e=>e.getAttribute('action')),'/api/contact');
 assert.deepEqual(result.errors,[]);result.passed=true;
 console.log(JSON.stringify(result,null,2));await writeFile('qa/updated/results.json',JSON.stringify(result,null,2));
} finally {await browser.close();await new Promise(r=>server.close(r));}
