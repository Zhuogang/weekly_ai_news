import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const docs=resolve(root,'docs');
async function files(dir){const results=[];for(const name of await readdir(dir)){const p=resolve(dir,name);if((await stat(p)).isDirectory())results.push(...await files(p));else results.push(p);}return results;}
let checked=0;
for(const path of (await files(docs)).filter(p=>p.endsWith('.html'))){
  const html=await readFile(path,'utf8');
  if(!html.includes('<main id="main"') || !html.includes('<title>'))throw Error(`Missing page structure: ${path}`);
  if(html.includes('MATHBLOCKPLACEHOLDER') || html.includes('genui'))throw Error(`Unresolved markup: ${path}`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)throw Error(`Duplicate IDs: ${path}`);
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const href=m[1];
    if(/^(?:https?:|mailto:|data:)/.test(href))continue;
    if(href.startsWith('#')){if(!ids.includes(href.slice(1)))throw Error(`Broken anchor ${href} in ${path}`);continue;}
    const clean=href.split('#')[0];
    const target=clean.startsWith('/weekly_ai_news/')?resolve(docs,clean.slice('/weekly_ai_news/'.length)||'index.html'):resolve(dirname(path),clean);
    await stat(target).catch(()=>{throw Error(`Broken local link ${href} in ${path}`);});
  }
  checked++;
}
for(const path of (await files(resolve(root,'reports'))).filter(p=>p.endsWith('.md'))){
  const output=resolve(docs,path.slice(root.length+1).replace(/\.md$/,'.html'));
  const html=await readFile(output,'utf8'),md=await readFile(path,'utf8');
  for(const m of md.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)){
    if(!html.includes(m[1].replace(/&/g,'&amp;')))throw Error(`Missing source URL ${m[1]}`);
  }
  if(path.endsWith('.partial.md')&&!html.includes('Partial archive.'))throw Error('Partial status lost');
}
console.log(`Verified ${checked} HTML pages, local links, section anchors, report coverage, partial labels, and original source URLs.`);
