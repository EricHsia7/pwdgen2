if(!self.define){let i,e={};const s=(s,n)=>(s=new URL(s+".js",n).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(n,t)=>{const o=i||("document"in self?document.currentScript.src:"")||location.href;if(e[o])return;let r={};const l=i=>s(i,o),u={module:{uri:o},exports:r,require:l};e[o]=Promise.all(n.map((i=>u[i]||l(i)))).then((i=>(t(...i),r)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-con52DG5fAqMPJ8Z"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/321.91fa111e772635aa5555.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.b1ce9aa6885a19e4ea12.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-8267f3fc.d043a338d8c391ea14ee.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.fbb1009fd2cf8a1d4670.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.8da81c81cb48dce02f91.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.0d86599e13ef18e65377.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
