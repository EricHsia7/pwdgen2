if(!self.define){let i,e={};const s=(s,n)=>(s=new URL(s+".js",n).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(n,t)=>{const d=i||("document"in self?document.currentScript.src:"")||location.href;if(e[d])return;let r={};const l=i=>s(i,d),o={module:{uri:d},exports:r,require:l};e[d]=Promise.all(n.map((i=>o[i]||l(i)))).then((i=>(t(...i),r)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-6CvFTHfe6D97DbAg"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/401.2ff15c365649b2950506.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/493.927d0d0cd8b5ab028238.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/667.62f56d4bf480d7c8c719.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/954.a8eca0f05a5281f29a14.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/969.2d22f892e6868f32df24.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.944723139c7cdc4414a6.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.83cf14bc0ef0d49888e8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.e067d2bbaa474258d23a.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.7dfc70f4d151be03b036.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-ad4d42fa.d936b10f90cca3273719.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-e43531e1.ba6996ddd9664ffad971.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
