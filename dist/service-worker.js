if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,n)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const l=i=>s(i,r),d={module:{uri:r},exports:o,require:l};e[r]=Promise.all(t.map((i=>d[i]||l(i)))).then((i=>(n(...i),o)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-NH5rHtR7pjDCIi2l"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/321.91fa111e772635aa5555.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-31743c5a.016beeb2b09f0d0118dc.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.15dafd5ee4fe7284da95.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-8267f3fc.0466531ed96eafe95cc6.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.60f0ad42e52a6593fe96.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-a9a05081.32ef5fee43233c30ed48.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
