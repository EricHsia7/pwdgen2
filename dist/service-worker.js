if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,n)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const l=i=>s(i,r),c={module:{uri:r},exports:o,require:l};e[r]=Promise.all(t.map((i=>c[i]||l(i)))).then((i=>(n(...i),o)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-4gFGtCgFLSOYWj2x"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/321.91fa111e772635aa5555.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-31743c5a.e91a8cf62d0bc915c368.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.785b4e11069cdc8ecf21.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-8267f3fc.0466531ed96eafe95cc6.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.60f0ad42e52a6593fe96.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-a9a05081.5e9d0c119be89be99a16.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
