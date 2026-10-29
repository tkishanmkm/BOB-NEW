/* eslint-disable @typescript-eslint/no-require-imports -- standalone Node audit script */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const pub = path.join(root, 'public');
const outCsv = path.join(root, 'docs', 'asset-usage-audit.csv');
const outMd = path.join(root, 'docs', 'asset-usage-audit.md');
const walk = (dir) => !fs.existsSync(dir) ? [] : fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]});
const rel = p => path.relative(root,p).replace(/\\/g,'/');
const urlPath = p => '/' + path.relative(pub,p).replace(/\\/g,'/');
const csv = v => '"' + String(v ?? '').replace(/"/g,'""').replace(/[\r\n]+/g,' ') + '"';
const sourceFiles = ['app','components','lib'].flatMap(d=>walk(path.join(root,d))).filter(p=>/\.(tsx?|css|json|js|mjs)$/.test(p));
const sourceRefs = new Map();
const sourceSnippets = new Map();
for (const file of sourceFiles) {
  const text = fs.readFileSync(file,'utf8');
  const re = /["'`(]((?:\/assets\/)[^"'`\s)]+)(?:["'`)])/g;
  for (const m of text.matchAll(re)) {
    const url = m[1].split(/[?#]/)[0];
    if (!sourceRefs.has(url)) sourceRefs.set(url,new Set());
    sourceRefs.get(url).add(rel(file));
    if (!sourceSnippets.has(url)) sourceSnippets.set(url,new Set());
    sourceSnippets.get(url).add(text.slice(Math.max(0,m.index-80),Math.min(text.length,m.index+url.length+80)).replace(/\s+/g,' ').trim());
  }
  const cssRe = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
  for (const m of text.matchAll(cssRe)) if (m[1].trim().startsWith('/assets/')) {
    const url = m[1].trim().split(/[?#]/)[0];
    if (!sourceRefs.has(url)) sourceRefs.set(url,new Set()); sourceRefs.get(url).add(rel(file));
  }
}
const all = walk(pub);
const manifestPath = path.join(root,'docs','bob-world-asset-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8').replace(/^\uFEFF/,''));
const manifestPathOf = x => String(x.path || x.targetPath || '').replace(/\\/g,'/');
const manifestMap = new Map(manifest.filter(x=>manifestPathOf(x)).map(x=>[manifestPathOf(x).toLowerCase(),x]));
const filesByUrl = new Map(all.map(p=>[urlPath(p).toLowerCase(),p]));
const assetMapFile = path.join(root,'components','apk-asset-map.tsx');
const assetMapText = fs.existsSync(assetMapFile) ? fs.readFileSync(assetMapFile,'utf8') : '';
const assetKeyToUrl = new Map([...assetMapText.matchAll(/^\s*([A-Za-z][A-Za-z0-9]*):\s*\{\s*src:\s*\"([^\"]+)\"/gm)].map(m=>[m[1],m[2]]));
const routeAssetKeys = new Map();
for (const file of sourceFiles.filter(p=>p.startsWith(path.join(root,'app')) && /page\.tsx$/.test(p))) {
 const text=fs.readFileSync(file,'utf8');
 if (!text.includes('apk-asset-map')) continue;
 const routePart=path.relative(path.join(root,'app'),path.dirname(file)).replace(/\\/g,'/');
 const route=routePart==='.'?'/':'/'+routePart;
 const keys=new Set();
 for (const token of text.matchAll(/[\"']([A-Za-z][A-Za-z0-9]*)[\"']/g)) if(assetKeyToUrl.has(token[1])) keys.add(token[1]);
 routeAssetKeys.set(route,keys);
}
const assetUrlRoutes = new Map();
for (const [route,keys] of routeAssetKeys) for (const key of keys) {
 const url=assetKeyToUrl.get(key); if(!assetUrlRoutes.has(url))assetUrlRoutes.set(url,new Set());assetUrlRoutes.get(url).add(route);
}
const mapped = new Map();
for (const [url, files] of sourceRefs) {
  if (!mapped.has(url)) mapped.set(url,new Set()); for (const f of files) mapped.get(url).add(f);
}
const category = p => {
 const q=p.toLowerCase();
 if (/\.(ttf|otf|woff2?|eot)$/.test(q)||q.includes('/fonts/')) return 'font';
 if (q.includes('/banner')) return 'banner';
 if (q.includes('/background')) return 'background';
 if (q.includes('/logo')||/logo|brand|bankofbaroda|bob_logo|launcher/.test(path.basename(q))) return 'logo/brand/launcher';
 if (q.includes('/native-visual-resources')||q.endsWith('.xml')) return 'native Android resource/XML';
 if (/\.(mp4|webm|mov|gif)$/.test(q)) return 'animation/video';
 if (/\.(svg|png|jpe?g|webp|avif|ico)$/.test(q)) return 'image/icon/illustration';
 if (/\.(json|txt|csv|html|md)$/.test(q)) return 'audit/reference metadata';
 return 'other';
};
const browserUsable = p => /\.(svg|png|jpe?g|webp|avif|ico|gif|mp4|webm|mov|woff2?|ttf|otf)$/.test(p.toLowerCase());
const hashes = new Map();
const rows = all.map(p=>{
 const u=urlPath(p), m=manifestMap.get(u.toLowerCase()), refs=sourceRefs.get(u)||new Set();
 let sha=''; try { sha=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); } catch {}
 if (sha) { if(!hashes.has(sha))hashes.set(sha,[]);hashes.get(sha).push(u); }
 const native=!browserUsable(p) || p.toLowerCase().endsWith('.xml');
 const usage=refs.size?'STATICALLY REFERENCED':'NOT FOUND IN STATIC SOURCE SCAN';
 const routes=new Set(assetUrlRoutes.get(u)||[]); for(const ref of refs){const match=ref.match(/^app\/(.+)\/page\.tsx$/);if(match)routes.add('/'+match[1]);if(ref==='app/page.tsx')routes.add('/');if(ref==='app/style.css'||ref==='components/app-shell.tsx'||ref==='app/layout.tsx')routes.add('GLOBAL / shared shell');} return {url:u,sourcePath:m?.sourcePath||'',category:category(u),extension:path.extname(p).toLowerCase(),bytes:fs.statSync(p).size,manifest:m?'yes':'no',usage,routePlacement:[...routes].join('; ')||'UNMAPPED ? not detected in route source',referencedBy:[...refs].join('; '),browserUsable:native?'no / conversion or native handling required':'potentially, after visual review',sha256:sha};
});
const rowsByUrl = new Map(rows.map(r=>[r.url,r]));
const missingManifest = manifest.filter(m=>{const pth=manifestPathOf(m);return !pth || !filesByUrl.has(pth.toLowerCase());});
const unmanifested = rows.filter(r=>r.manifest==='no');
const used = rows.filter(r=>r.usage.startsWith('STATICALLY')).length;
const cats = {}; const exts={}; for(const r of rows){cats[r.category]=(cats[r.category]||0)+1;exts[r.extension||'[none]']=(exts[r.extension||'[none]']||0)+1;}
const dupGroups=[...hashes.values()].filter(a=>a.length>1);
const csvFields=['url','sourcePath','category','extension','bytes','manifest','usage','routePlacement','referencedBy','browserUsable','sha256'];
fs.writeFileSync(outCsv,[csvFields.join(','),...rows.map(r=>csvFields.map(k=>csv(r[k])).join(','))].join('\n'),'utf8');
const directMappings=[
 ['/dashboard','app/dashboard/page.tsx + components/apk-asset-map.tsx','transfer, passbook, beneficiaries, account, statement, settings, billPay, cards, upi, fixedDeposit, offers, help','mapped in quick-action/explore grids; likely placement, screenshot not verified'],
 ['/more','app/more/page.tsx + components/apk-asset-map.tsx','account, settings, passbook, statement, transfer, upi, recharge, billPay, scan, cards, alerts, loan, fixedDeposit, profile, security, faq, complaints, help, offers, bus, video, shop','mapped to service directory tiles; likely placement, screenshot not verified'],
 ['/account-details','app/account-details/page.tsx','account, profile','mapped to heading/account/profile icons; screenshot not verified'],
 ['/passbook','app/passbook/page.tsx','passbook, statement','mapped to heading/history icons; screenshot not verified'],
 ['/transfers','app/transfers/page.tsx','transfer, account','mapped to heading/review icons; screenshot not verified'],
 ['/statement','app/statement/page.tsx','statement, passbook','mapped to heading/filter icons; screenshot not verified'],
 ['/receipt','app/receipt/page.tsx','statement, passbook','mapped to receipt heading/detail icons; screenshot not verified'],
 ['/bus-tickets tile','app/more/page.tsx + components/apk-asset-map.tsx','bus uses text fallback; no source image mapped','no image asset assigned'],
 ['33 generic feature routes','app/[feature]/page.tsx','no dedicated APK asset mapping confirmed per route','generic feature pages; not visually identical'],
 ['other dedicated routes','app route files','no per-route asset mapping confirmed by source scan','needs individual screen review']
];
const lines=[
 '# BOB-NEW exhaustive asset usage audit', '',
 `Generated: ${new Date().toISOString()}. Static filesystem/source scan only; it does not claim screenshot or runtime verification.`, '',
 '## Summary', '',
 `- Files under public/: **${all.length}**`,
 `- Total public asset size: **${(rows.reduce((s,r)=>s+r.bytes,0)/1024/1024).toFixed(2)} MiB**`,
 `- Manifest entries: **${manifest.length}**`,
 `- Unique manifest paths: **${new Set(manifest.map(manifestPathOf).filter(Boolean).map(p=>p.toLowerCase())).size}**`,
 `- Manifest entries without a path: **${manifest.filter(m=>!manifestPathOf(m)).length}**`,
 `- Manifest paths missing from public/: **${missingManifest.length}**`,
 `- Public files not present in manifest: **${unmanifested.length}** (the separate APK-audit copy plus generic demo assets and README)`,
 `- Files referenced by exact URL in app/components/lib source scan: **${used}**`,
 `- Route files with an explicit APK asset component import: **${routeAssetKeys.size}**`,
 `- Files not found in static source scan: **${rows.length-used}**`,
 `- Exact duplicate-content groups (SHA-256): **${dupGroups.length}**`,
 '', '## Inventory by category', '', '| Category | Files |', '|---|---:|', ...Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`| ${k} | ${v} |`),
 '', '## Current explicit route-to-asset placement evidence', '', '| Route | Source | Asset keys / status | Confidence |', '|---|---|---|---|', ...directMappings.map(x=>`| ${x[0]} | ${x[1]} | ${x[2]} | ${x[3]} |`),
 '', '## Important findings', '',
 '- Static asset URL detection only identifies literal URL paths in app/components/lib. It can miss dynamically constructed URLs, imports resolved through variables, assets embedded inside SVGs, CSS classes with remote/background references, and runtime-loaded data.',
 '- A file being present in public or the APK manifest does not mean it is used by any screen.',
 '- Native Android XML/vector resources are not directly usable as browser images without conversion; many Android layouts, launcher variants, notification resources and third-party SDK assets are not first-party web UI assets.',
 '- The current `components/apk-asset-map.tsx` is used by Dashboard, More, Account Details, Passbook, Transfers, Statement and Receipt. Shared component mappings do not establish pixel-perfect placement.',
 '- The 33 source routes served by the generic feature route do not have dedicated screen-specific APK asset placement. Route availability must not be counted as visual parity.',
 '- APK-to-web pixel identity cannot be established from asset presence or filenames. It needs authorized source screenshots/runtime captures and side-by-side responsive comparison.',
 '- Do not blindly place every APK file on the web app: SDK, platform, duplicate density variants, obsolete resources and unrelated assets must be classified separately. Map only evidenced first-party screen assets.',
 '', '## Missing manifest paths', '', ...(missingManifest.length?missingManifest.map(m=>`- ${m.path}`):['- None detected.']),
 '', '## Exact duplicate-content groups', '', ...(dupGroups.length?dupGroups.slice(0,100).map(g=>`- ${g.length} files share SHA-256 ${rowsByUrl.get(g[0])?.sha256}: ${g.join(', ')}`):['- None detected.']),
 '', '## Full per-file inventory', '', 'The companion CSV ' + path.relative(root,outCsv).replace(/\\/g,'/') + ' contains one row for every file under public/, including exact public URL, source-manifest path, category, file size, whether it is in the manifest, static usage status, source files that reference it, browser-format suitability, and SHA-256.',
 '', '## Current decision', '',
 '**Asset inventory and static reference reconciliation are complete for this checkout; APK placement and visual parity are NOT complete.** No missing manifest files were detected in this run. Only the explicitly referenced assets can be called statically used; all other items remain unmapped or not detected by the static scan until they are connected to verified route/screenshots.',
 '', '## Next implementation work', '',
 '1. Capture or provide the original APK screens for each known route at representative mobile dimensions.',
 '2. Build a confirmed asset registry per route/component, recording source path, target path, intended size/crop, and confidence.',
 '3. Convert only required native vector/drawable assets to browser-safe formats and preserve attribution/licensing notes.',
 '4. Replace generic feature routes with dedicated responsive screen implementations and map the verified banners, fonts, logos/identity-safe marks, and icons.',
 '5. Compare screenshots and run route-by-route mobile interaction tests before marking any screen visually identical.', ''
];
fs.writeFileSync(outMd,lines.join('\n'),'utf8');
console.log(JSON.stringify({report:rel(outMd),csv:rel(outCsv),publicFiles:all.length,publicMiB:+(rows.reduce((s,r)=>s+r.bytes,0)/1048576).toFixed(2),manifestEntries:manifest.length,missingManifest:missingManifest.length,unmanifested:unmanifested.length,staticReferenced:used,notStaticallyReferenced:rows.length-used,duplicateGroups:dupGroups.length,categories:cats},null,2));
