if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,n)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let l={};const o=i=>s(i,r),d={module:{uri:r},exports:l,require:o};e[r]=Promise.all(t.map((i=>d[i]||o(i)))).then((i=>(n(...i),l)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-w9kUiqSmeSKpAIW6"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/125.29e8b5003e5256f5e250.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/401.2ff15c365649b2950506.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/493.927d0d0cd8b5ab028238.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/667.62f56d4bf480d7c8c719.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/954.a8eca0f05a5281f29a14.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.50f4cadd5a9a2fd4a33b.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-8267f3fc.489bbb03ad51121f26dc.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.5b316777693fd0e49a56.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.60f0ad42e52a6593fe96.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.cc06aac4775b7d6f5e91.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
