if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,n)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const l=i=>s(i,r),u={module:{uri:r},exports:o,require:l};e[r]=Promise.all(t.map((i=>u[i]||l(i)))).then((i=>(n(...i),o)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-hhLIU9gYS5YyYTYe"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/321.91fa111e772635aa5555.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.d07504a0cf965a330b9d.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-8267f3fc.e7a6beeb80506e8e796e.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.fb618eea47285b73a86c.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.60f0ad42e52a6593fe96.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.8e19511788f4fd21eb16.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
