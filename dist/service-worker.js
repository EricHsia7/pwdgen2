if(!self.define){let i,e={};const s=(s,n)=>(s=new URL(s+".js",n).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(n,t)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let l={};const d=i=>s(i,r),o={module:{uri:r},exports:l,require:d};e[r]=Promise.all(n.map((i=>o[i]||d(i)))).then((i=>(t(...i),l)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-KPWfH9Y55s5PlhgH"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/133.b92e9e63efb9a1aa3bef.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.a220288cba6943107e1a.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/401.eae46c7812309b9a7f75.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/493.af82898f9163ace57d6d.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/667.71a2c49e955a37ba7468.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/700.193b6d92fdd1426caf62.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.c750dadca4311f4a2121.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/954.7558144e4318e2e00aeb.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/992.c131cc2e881c3133a801.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.d2e17b1afd95887c0ade.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.1d461c57ef0c6f994d99.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.a1d400eeea5f525af210.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.cce0b2286728593cf144.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-a9a05081.70580e9e3f9db87f5293.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-ad4d42fa.ef17cb93a71406cea6c9.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
