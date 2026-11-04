import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createContact} from './api/contact.js';

test('Vercel parsed bodies, HTTPS origins, validation and separate client limits',async()=>{
 let sent=0;
 const handle=createContact({env:{VERCEL:'1'},sendMail:async fields=>{sent++;assert.equal(fields.message,'Hello');return 'mock';}});
 const server=http.createServer(async(req,res)=>{
  let raw='';for await(const chunk of req)raw+=chunk;
  req.body=req.headers['content-type'].includes('json')?JSON.parse(raw):Object.fromEntries(new URLSearchParams(raw));
  await handle(req,res);
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const host=`127.0.0.1:${server.address().port}`,url=`http://${host}/api/contact`;
 const post=(message,ip='192.0.2.1',origin=`https://${host}`)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'X-Forwarded-For':ip},body:JSON.stringify({email:'qa@example.com',message})});
 try{
  assert.equal((await post('Hello')).status,200);
  assert.equal((await post('Hello','192.0.2.1','https://other.example')).status,403);
  assert.equal((await post('   ')).status,400);
  for(let i=0;i<3;i++)assert.equal((await post('Hello')).status,200);
  assert.equal((await post('Hello')).status,429);
  assert.equal((await post('Hello','192.0.2.2')).status,200);
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded',Origin:`https://${host}`,'X-Forwarded-For':'192.0.2.3'},body:'email=qa%40example.com&message=Hello'});
  assert.equal(r.status,200);assert.match(await r.text(),/Your message has been submitted/);assert.equal(sent,6);
 }finally{await new Promise(r=>server.close(r));}
});
