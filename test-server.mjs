import test from 'node:test';import assert from 'node:assert/strict';import {createApp,deliverMail} from './server.mjs';
async function serve(options,run){const s=createApp(options);await new Promise(r=>s.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${s.address().port}`;try{await run(base);}finally{await new Promise(r=>s.close(r));}}
const post=(base,body,headers={})=>fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
test('real adapter reports missing config; does not pretend success',async()=>{await serve({env:{}},async base=>{assert.equal((await post(base,{email:'visitor@example.com',message:'Hello'})).status,503);});});
test('fields, duplicate prevention and mail payload',async()=>{let calls=0;await serve({sendMail:async f=>{calls++;assert.equal(f.message,'Hi <b>there</b>');return 'test-only';}},async base=>{const data={email:'visitor@example.com',name:'Visitor',subject:'Catering',message:'Hi <b>there</b>'};assert.equal((await post(base,data,{'Idempotency-Key':'test-1'})).status,200);assert.equal((await post(base,data,{'Idempotency-Key':'test-1'})).status,200);assert.equal(calls,1);assert.equal((await post(base,{...data,message:'Changed'},{'Idempotency-Key':'test-1'})).status,409);});});
test('reject invalid input, honeypot, cross-origin and oversized body',async()=>{await serve({sendMail:async()=>assert.fail('must not send')},async base=>{assert.equal((await post(base,{email:'bad'})).status,400);assert.equal((await post(base,{email:'a@b.com',website:'spam'})).status,400);assert.equal((await post(base,{email:'a@b.com'},{Origin:'https://other.example'})).status,403);assert.equal((await post(base,{email:'a@b.com',message:'a'.repeat(26000)})).status,413);assert.equal((await post(base,{email:[]})).status,400);});});
test('provider failure preserves failure and rate limits',async()=>{await serve({sendMail:async()=>{throw new Error('provider failed');}},async base=>{for(let i=0;i<5;i++)assert.equal((await post(base,{email:'a@b.com',message:'Hello'})).status,502);assert.equal((await post(base,{email:'a@b.com'})).status,429);});});
test('non-JS submission and static routes',async()=>{await serve({sendMail:async()=> 'mock'},async base=>{const r=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'email=visitor%40example.com&message=Hello'});assert.equal(r.status,200);assert.match(await r.text(),/Your message has been submitted/);for(const route of ['/','/online/','/contact-us/'])assert.equal((await fetch(base+route)).status,200);assert.equal((await fetch(base+'/.env')).status,404);});});
test('Resend adapter uses fixed recipient, reply-to, plain text and key',async()=>{await deliverMail({email:'visitor@example.com',name:'A',subject:'Hi',message:'<b>message</b>'},'test-key',{RESEND_API_KEY:'test-only',MAIL_FROM:'Site <site@example.com>'},async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');const body=JSON.parse(options.body);assert.deepEqual(body.to,['goodcoconut01@gmail.com']);assert.equal(body.reply_to,'visitor@example.com');assert.equal(body.html,undefined);assert.match(body.text,/<b>message<\/b>/);assert.equal(options.headers['Idempotency-Key'],'test-key');return {ok:true,json:async()=>({id:'mock'})};});});

test('empty and whitespace-only messages never reach the mail provider',async()=>{await serve({sendMail:async()=>assert.fail('must not send')},async base=>{for(const message of ['', '   '])assert.equal((await post(base,{email:'visitor@example.com',message})).status,400);});});

test('video streams support playback, seeking, HEAD and unsatisfiable ranges',async()=>{
 const {readFile}=await import('node:fs/promises');
 const media='/assets/moments/coconut-day-out.mp4';
 const bytes=await readFile(new URL('./public'+media,import.meta.url));
 await serve({},async base=>{
  const head=await fetch(base+media,{method:'HEAD'});
  assert.equal(head.status,200);assert.equal(head.headers.get('content-type'),'video/mp4');
  assert.equal(Number(head.headers.get('content-length')),bytes.length);
  assert.equal(head.headers.get('accept-ranges'),'bytes');assert.equal((await head.arrayBuffer()).byteLength,0);
  for(const [range,start,end] of [['bytes=0-99',0,99],['bytes=100-',100,bytes.length-1],['bytes=-128',bytes.length-128,bytes.length-1],['bytes=0-999999999',0,bytes.length-1]]){
   const response=await fetch(base+media,{headers:{Range:range}});
   assert.equal(response.status,206);assert.equal(response.headers.get('content-range'),`bytes ${start}-${end}/${bytes.length}`);
   assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes.subarray(start,end+1));
  }
  for(const range of [`bytes=${bytes.length}-`,'bytes=10-2','bytes=-0','bytes=-','bytes=0-1,3-4']){
   const response=await fetch(base+media,{headers:{Range:range}});
   assert.equal(response.status,416);assert.equal(response.headers.get('content-range'),`bytes */${bytes.length}`);
   assert.equal((await response.arrayBuffer()).byteLength,0);
  }
 });
});
