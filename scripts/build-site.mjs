import { readFile, writeFile, readdir, mkdir, rm, cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import katex from 'katex';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist');
const repo = 'https://github.com/Zhuogang/weekly_ai_news';
const base = 'https://zhuogang.github.io/weekly_ai_news/';
const archiveStatus = JSON.parse(await readFile(resolve(root, 'archive-status.json'), 'utf8'));
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = s => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`#]/g, '').trim();
const formatDate = date => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric', timeZone:'UTC'});

const reports = [];
for (const year of (await readdir(resolve(root, 'reports'))).sort()) {
  if (!/^\d{4}$/.test(year)) continue;
  for (const file of (await readdir(resolve(root, 'reports', year))).sort()) {
    if (!/^\d{4}-\d{2}-\d{2}(\.partial)?\.md$/.test(file)) continue;
    const date = file.slice(0,10);
    if (!date.startsWith(year)) throw new Error(`Report year mismatch: ${file}`);
    if (reports.some(r => r.date === date)) throw new Error(`Duplicate original report date: ${date}`);
    const source = `reports/${year}/${file}`;
    const md = await readFile(resolve(root, source), 'utf8');
    // Older originals used bold section labels. Promote them only in the reading view.
    const renderMd = md
      .replace(/^\*\*(AI Research & Engineering Digest[^*\n]*)\*\*[ \t]*$/m, '# $1')
      .replace(/^\*\*((?:\d+\.\s.+|The two most worthwhile deeper reads|One concrete experiment:[^\n]+))\*\*[ \t]*$/gm, '## $1');
    const headings = [...renderMd.matchAll(/^## (.+)$/gm)].map(m => plain(m[1]));
    const highlights = [];
    for (const line of renderMd.split(/^## /m)[0].split('\n')) {
      if (/^- /.test(line)) highlights.push(plain(line.slice(2)));
    }
    reports.push({date, file, source, md, renderMd, headings, highlights: highlights.slice(0,3), partial:file.includes('.partial.'), href:`reports/${year}/${file.replace(/\.md$/, '.html')}`, minutes:Math.ceil(md.split(/\s+/).length/220)});
  }
}
reports.sort((a,b) => b.date.localeCompare(a.date));
if (!reports.length) throw new Error('No reports found');
const latest = reports.find(r => !r.partial);
if (!latest) throw new Error('No complete report found');

function shell(title, content, prefix = '', description = 'A curated AI research and engineering digest. Papers, models, systems, and ideas worth your time.', path = '') {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} · AI Fieldnotes</title><meta name="description" content="${escape(description)}"><meta name="color-scheme" content="light dark"><link rel="canonical" href="${base}${path}">
<link rel="stylesheet" href="${prefix}assets/style.css">
<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><script src="${prefix}assets/site.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="${prefix}index.html"><span class="brand-icon" aria-hidden="true">a/f</span><span>AI Fieldnotes<small>Research & engineering digest</small></span></a><nav aria-label="Main navigation"><a href="${prefix}index.html#archive">Archive</a><a href="${repo}">GitHub ↗</a></nav></header>
${content}
<footer class="site-footer"><span>Curated for curious researchers. Built for useful work.</span><a href="${repo}">Markdown originals ↗</a><p>Archived claims are preserved as written and are not revalidated by publication. <a href="${repo}#archive-provenance-and-gaps">Recovery status and gaps ↗</a></p></footer></body></html>\n`;
}

const cards = reports.map(r => `<article class="archive-card" data-search="${escape([r.date,formatDate(r.date),...r.headings,...r.highlights].join(' ').toLowerCase())}"><div class="card-meta"><time datetime="${r.date}">${formatDate(r.date)}</time><span class="badge ${r.partial?'partial':''}">${r.partial?'Partial archive':'Complete issue'}</span></div><h3><a href="${r.href}">${r.partial?'Recovered fieldnotes':'AI Research & Engineering Digest'}</a></h3><p>${escape(r.partial?'The available original text is preserved; missing sections are identified in the report.':r.headings.slice(0,3).map(h=>h.replace(/^\d+\.\s*/, '')).join(' · '))}</p><a class="text-link" href="${r.href}">${r.partial?'Read available excerpt':'Read issue'} <span aria-hidden="true">↗</span></a></article>`).join('\n');
const home = shell('The reading room', `<main id="main"><section class="hero"><p class="eyebrow"><span class="live-dot"></span> Papers. Systems. Ideas.</p><h1>Less noise.<br>More <em>signal.</em></h1><p class="hero-intro">AI moves fast. These are the ideas worth slowing down for — from new research to the engineering that makes it work.</p><div class="hero-bottom"><span>Computer vision / Multimodal / Agents / Inference</span><span>Wednesday & Sunday editions</span></div></section>
<section class="latest" aria-labelledby="latest-heading"><div class="latest-label"><p class="eyebrow">Latest complete issue</p><div class="issue-date">${new Date(latest.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'2-digit',timeZone:'UTC'})}</div><span>${latest.date.slice(0,4)} · ~${latest.minutes} min read</span><a class="button" href="${latest.href}">Read the digest <span aria-hidden="true">↗</span></a></div><div class="latest-content"><h2 id="latest-heading">${escape(latest.headings[0]?.replace(/^\d+\.\s*/, '') || 'AI Research & Engineering Digest')}</h2><ul>${latest.highlights.map(h=>`<li>${escape(h)}</li>`).join('')}</ul><a class="text-link" href="${latest.href}">The full issue, sources & one experiment ↗</a></div></section>
<section class="archive" id="archive" aria-labelledby="archive-heading"><div class="section-heading"><div><p class="eyebrow">The collection</p><h2 id="archive-heading">Every issue. One place.</h2></div><span>${reports.filter(r=>!r.partial).length} complete · ${reports.filter(r=>r.partial).length} partial</span></div><label class="search-label" for="search">Find an issue by date or topic</label><input id="search" type="search" placeholder="Try multimodal, inference, November…" autocomplete="off"><p id="search-status" class="search-status" role="status" aria-live="polite"></p><div class="archive-grid">${cards}</div><p class="archive-note">${escape(archiveStatus.archive_note)} <a href="${repo}#archive-provenance-and-gaps">Provenance and gaps ↗</a></p></section></main>`);

await rm(out, {recursive:true,force:true});
await mkdir(resolve(out,'assets'), {recursive:true});
await cp(resolve(root,'site/assets'),resolve(out,'assets'),{recursive:true});
await writeFile(resolve(out,'index.html'),home);
await writeFile(resolve(out,'.nojekyll'),'');
for (let i=0;i<reports.length;i++) {
  const r=reports[i], toc=[], used=new Map();
  const md = new Marked({gfm:true, extensions:[{
    name:'inlineMath', level:'inline',
    start(src) { return /\$(?=[^\s$\d])/.exec(src)?.index; },
    tokenizer(src) {
      // Requiring a nonnumeric first character keeps dollar prices out of math.
      const match = /^\$([^\s$\d](?:[^$\n]*?[^\s$])?)\$(?!\d)/.exec(src);
      if (match) return {type:'inlineMath', raw:match[0], text:match[1]};
    },
    renderer({text}) { return katex.renderToString(text,{output:'mathml',throwOnError:true,trust:false}); }
  }], renderer:{
    html({text}) { return text.startsWith('<!--')?'':escape(text); },
    heading({tokens, depth, text}) {
      const stem=plain(text).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'section';
      const count=used.get(stem)||0; used.set(stem,count+1);
      const id=stem+(count?`-${count}`:'');
      if(depth===2) toc.push({id,title:plain(text)});
      return `<h${depth} id="${escape(id)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
    link({href, tokens, title}) {
      const safe=/^(https?:\/\/|mailto:|#|\.\.?\/)/i.test(href);
      return safe?`<a href="${escape(href)}"${title?` title="${escape(title)}"`:''}>${this.parser.parseInline(tokens)}</a>`:this.parser.parseInline(tokens);
    }
  }});
  // Build-time math keeps the reading site self-contained; source Markdown stays intact.
  const math=[];
  const prepared=r.renderMd.replace(/\$\$([\s\S]+?)\$\$/g,(_,s)=>{
    const token=`MATHBLOCKPLACEHOLDER${math.length}END`;
    math.push(katex.renderToString(s.trim(),{output:'mathml',displayMode:true,throwOnError:true,trust:false}));
    return `\n\n${token}\n\n`;
  });
  let body=md.parse(prepared);
  math.forEach((html,index)=>{body=body.replace(`<p>MATHBLOCKPLACEHOLDER${index}END</p>`,html);});
  const previous=reports[i+1], next=reports[i-1];
  const desc=r.highlights[0]||'Recovered partial AI research and engineering digest.';
  const page=shell(`${formatDate(r.date)} digest`, `<main id="main" class="report-main"><div class="report-toolbar"><a href="../../index.html#archive">← All issues</a><span>${formatDate(r.date)} · ${r.partial?'Partial archive':`~${r.minutes} min read`}</span><a href="${repo}/blob/main/${r.source}">View Markdown ↗</a></div>${r.partial?'<aside class="partial-banner"><strong>Partial archive.</strong> This is an incomplete recovered original. Missing material has not been reconstructed.</aside>':''}<div class="report-layout"><aside class="contents"><p class="eyebrow">In this issue</p><nav aria-label="Table of contents">${toc.map(h=>`<a href="#${escape(h.id)}">${escape(h.title)}</a>`).join('')}</nav><a class="text-link" href="${repo}/blob/main/${r.source}">Original & sources ↗</a></aside><article class="prose">${body}<nav class="issue-nav" aria-label="Other issues">${previous?`<a href="../${previous.date.slice(0,4)}/${previous.file.replace(/\.md$/,'.html')}">← ${formatDate(previous.date)}</a>`:'<span></span>'}${next?`<a href="../${next.date.slice(0,4)}/${next.file.replace(/\.md$/,'.html')}">${formatDate(next.date)} →</a>`:'<span></span>'}</nav></article></div></main>`, '../../',desc,r.href);
  await mkdir(dirname(resolve(out,r.href)),{recursive:true});
  await writeFile(resolve(out,r.href),page);
}
// Keep published links to a former partial issue useful after the original is recovered.
for (const entry of archiveStatus.reports.filter(r => r.replaced_path)) {
  const alias=entry.replaced_path.replace(/\.md$/, '.html');
  const target=entry.path.replace(/^.*\//,'').replace(/\.md$/,'.html');
  const page=shell('Complete original recovered',`<main id="main" class="hero"><h1>The full issue is here.</h1><p>The original report has been recovered. <a href="${target}">Read ${formatDate(entry.date)} →</a></p></main>`,'../../','The complete original report has replaced this partial archive.',entry.path.replace(/\.md$/,'.html'));
  await mkdir(dirname(resolve(out,alias)),{recursive:true});
  await writeFile(resolve(out,alias),page.replace('</head>',`<meta http-equiv="refresh" content="0;url=${target}"></head>`));
}
await writeFile(resolve(out,'404.html'),shell('Page not found','<main id="main" class="hero"><p class="eyebrow">404</p><h1>A missing page.</h1><p>This link may have moved. <a href="/weekly_ai_news/">Return to the reading room →</a></p></main>','/weekly_ai_news/'));
console.log(`Built ${reports.length} reports (${reports.filter(r=>r.partial).length} partial). Latest complete: ${latest.date}.`);
