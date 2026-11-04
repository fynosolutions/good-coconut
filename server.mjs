import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {randomUUID,createHash} from 'node:crypto';
const root=resolve(fileURLToPath(new URL('./public/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
export async function deliverMail(fields,key,env=process.env,fetcher=fetch){
 if(!env.RESEND_API_KEY||!env.MAIL_FROM)throw Object.assign(new Error('Sending is temporarily unavailable. Please email goodcoconut01@gmail.com; your message has not been sent.'),{status:503});
 const response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({from:env.MAIL_FROM,to:[env.MAIL_TO||'goodcoconut01@gmail.com'],reply_to:fields.email,subject:`Good Coconut inquiry: ${fields.subject||'Website contact'}`,text:`First name: ${fields.name||'(not provided)'}\nEmail: ${fields.email}\nSubject: ${fields.subject||'(not provided)'}\n\n${fields.message||'(No message provided)'}`}),signal:AbortSignal.timeout(12000)});
 const result=await response.json();if(!response.ok||!result.id)throw Object.assign(new Error('Your message could not be submitted. Please try again or email goodcoconut01@gmail.com.'),{status:502});
 return result.id;
}
export function createHandler({sendMail=deliverMail,env=process.env}={}){
 const attempts=new Map(),completed=new Map(),pending=new Map();
 return async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-src https://www.google.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  const json=req.headers['content-type']?.includes('application/json');
  function respond(status,message){res.statusCode=status;res.setHeader('Cache-Control','no-store');if(json){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify({message}));}else{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Message status | Good Coconut</title><link rel="stylesheet" href="/styles.css"><main class="wrap section"><h1>${status===200?'Thank you.':'Message not sent.'}</h1><p>${message}</p><p><a href="/contact-us/">Return to contact form</a></p></main></html>`);}}
  try{
   const pathname=new URL(req.url,'http://localhost').pathname;
   if(pathname==='/api/contact'){
    if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(405,'Please use the contact form.');}
    const expected=env.PUBLIC_ORIGIN||`${env.VERCEL?'https':'http'}://${req.headers.host}`;
    if((req.headers.origin&&req.headers.origin!==expected)||req.headers['sec-fetch-site']==='cross-site')return respond(403,'Please submit the form from this website.');
    if(!['application/json','application/x-www-form-urlencoded'].some(t=>req.headers['content-type']?.startsWith(t)))return respond(415,'Unsupported form format.');
    const now=Date.now();for(const [k,v]of attempts)if(v.expires<now)attempts.delete(k);for(const [k,v]of completed)if(v.expires<now)completed.delete(k);
    const ip=(env.VERCEL&&req.headers['x-forwarded-for']?.split(',')[0].trim())||req.socket.remoteAddress;const usage=attempts.get(ip)||{count:0,expires:now+600000};usage.count++;attempts.set(ip,usage);if(usage.count>5){res.setHeader('Retry-After',String(Math.ceil((usage.expires-now)/1000)));return respond(429,'Too many attempts. Please wait ten minutes or contact us by email.');}
    let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>24576)return respond(413,'Your message is too long. Please shorten it.');}
    let data;try{data=json?JSON.parse(raw):Object.fromEntries(new URLSearchParams(raw));}catch{return respond(400,'Please check your form and try again.');}
    if(!data||typeof data!=='object'||Array.isArray(data))return respond(400,'Invalid form.');
    const limits={name:100,email:254,subject:160,message:5000,website:200},fields={};for(const [key,max]of Object.entries(limits)){if(data[key]!==undefined&&typeof data[key]!=='string')return respond(400,'Please enter text in each field.');fields[key]=(data[key]||'').trim();if(fields[key].length>max)return respond(400,'One of your fields is too long. Please shorten it.');}
    if(fields.website)return respond(400,'Unable to submit this form. Please contact us by email.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||/[\r\n]/.test(fields.subject+fields.name))return respond(400,'Please enter a valid email address and single-line name and subject.');
    if(!fields.message)return respond(400,'Please write a message so we can help with your inquiry.');
    const key=req.headers['idempotency-key']||randomUUID();if(!/^[a-zA-Z0-9-]{1,100}$/.test(key))return respond(400,'Invalid submission identifier. Please reload the form.');
    const hash=createHash('sha256').update(JSON.stringify(fields)).digest('hex');
    const previous=completed.get(key)||pending.get(key);if(previous&&previous.hash!==hash)return respond(409,'This submission changed. Please reload and try again.');
    if(!completed.has(key)){
     if(pending.has(key))await pending.get(key).promise;
     else{const promise=sendMail(fields,key,env);pending.set(key,{hash,promise});try{await promise;completed.set(key,{hash,expires:now+86400000});}finally{pending.delete(key);}}
    }
    return respond(200,'Your message has been submitted. We will reply to the email you provided.');
   }
   if(!['GET','HEAD'].includes(req.method))return respond(405,'Method not allowed.');
   let decoded;try{decoded=decodeURIComponent(pathname);}catch{return respond(400,'Invalid address.');}
   if(decoded.includes('\\')||decoded.includes('\0'))return respond(404,'Page not found.');
   let path=resolve(root,'.'+decoded);if(path!==root&&!path.startsWith(root+sep))return respond(404,'Page not found.');
   try{if((await stat(path)).isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'});return res.end();}path=resolve(path,'index.html');}const file=await readFile(path);res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(req.method==='HEAD'?undefined:file);}catch{return respond(404,'Page not found. Return to the home page to continue.');}
  }catch(error){respond(error.status||502,error.status?error.message:'Sending is unavailable right now. Please try again or email goodcoconut01@gmail.com.');}
 };
}
export function createApp(options){
 const server=http.createServer(createHandler(options));server.requestTimeout=20000;server.headersTimeout=15000;return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const port=Number(process.env.PORT)||4185;createApp().listen(port,'127.0.0.1',()=>console.log(`Good Coconut local preview: http://127.0.0.1:${port}`));}

