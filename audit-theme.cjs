// Read-only structural checks. Does not execute the downloaded theme.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.argv[2]||path.join(__dirname,'theme-review','fashe'));
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);e.isDirectory()?walk(p):files.push(p);}}
walk(root);
let json=0,schemas=0,refs=0;const errors=[];
for(const file of files){
 const text=fs.readFileSync(file,'utf8');
 if(file.endsWith('.json')){try{JSON.parse(text);json++;}catch(e){errors.push(path.relative(root,file)+': '+e.message);}}
 if(!file.endsWith('.liquid'))continue;
 for(const match of text.matchAll(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/g)){try{JSON.parse(match[1]);schemas++;}catch(e){errors.push(path.relative(root,file)+': schema '+e.message);}}
 for(const match of text.matchAll(/{%-?\s*(render|section|sections)\s+['"]([^'"]+)['"]/g)){
  const dir=match[1]==='render'?'snippets':'sections',ext=match[1]==='sections'?'.json':'.liquid';refs++;
  if(!fs.existsSync(path.join(root,dir,match[2]+ext)))errors.push('Missing reference: '+match[2]);
 }
}
console.log(JSON.stringify({files:files.length,json,schemas,refs,errors},null,2));
if(errors.length)process.exitCode=1;
