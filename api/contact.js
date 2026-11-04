import {Readable} from 'node:stream';
import {createHandler} from '../server.mjs';

export function createContact(options){
const handle=createHandler(options);
return function contact(req,res){
 // Vercel may parse the body before invoking a Node function.
 if(req.body!==undefined){
  const json=req.headers['content-type']?.includes('application/json');
  const body=typeof req.body==='string'||Buffer.isBuffer(req.body)?req.body:json?JSON.stringify(req.body):new URLSearchParams(req.body).toString();
  const stream=Readable.from([Buffer.from(body)]);
  Object.assign(stream,{method:req.method,url:'/api/contact',headers:req.headers,socket:req.socket});
  return handle(stream,res);
 }
 req.url='/api/contact';
 return handle(req,res);
};
}
export default createContact();
