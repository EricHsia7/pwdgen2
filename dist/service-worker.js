if(!self.define){let i,e={};const s=(s,n)=>(s=new URL(s+".js",n).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(n,t)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let l={};const o=i=>s(i,r),u={module:{uri:r},exports:l,require:o};e[r]=Promise.all(n.map((i=>u[i]||o(i)))).then((i=>(t(...i),l)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-97esArQCmDhb8hTH"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/133.b92e9e63efb9a1aa3bef.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/390.a220288cba6943107e1a.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/401.eae46c7812309b9a7f75.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/493.af82898f9163ace57d6d.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/667.71a2c49e955a37ba7468.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/700.193b6d92fdd1426caf62.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.c750dadca4311f4a2121.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/954.7558144e4318e2e00aeb.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/992.c131cc2e881c3133a801.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.340cceff099639aa53fa.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.3a77fe71c3ed3798f7af.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.6787ba833bec4fb621b8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.86d8449a9049c1861057.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-a9a05081.eea800e20fc1ae9306a7.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-ad4d42fa.35069cb7299f846c9fe2.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
