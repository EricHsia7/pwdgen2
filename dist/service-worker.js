if(!self.define){let i,e={};const s=(s,t)=>(s=new URL(s+".js",t).href,e[s]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=s,i.onload=e,document.head.appendChild(i)}else i=s,importScripts(s),e()})).then((()=>{let i=e[s];if(!i)throw new Error(`Module ${s} didn’t register its module`);return i})));self.define=(t,n)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let d={};const l=i=>s(i,r),o={module:{uri:r},exports:d,require:l};e[r]=Promise.all(t.map((i=>o[i]||l(i)))).then((i=>(n(...i),d)))}}define(["./workbox-6110bacb"],(function(i){"use strict";i.setCacheNameDetails({prefix:"pwdgen2-4w2aRdPd7hFesg1R"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/dist/390.d6566d4591e74143aba8.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/401.2ff15c365649b2950506.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/486.b4e126b801c87572a8f1.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/493.927d0d0cd8b5ab028238.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/667.62f56d4bf480d7c8c719.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/826.943a523f10383eca13e2.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/954.a8eca0f05a5281f29a14.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/969.2d22f892e6868f32df24.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-6dee17fb.5148567d0efe0fa528a7.min.css",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-84781932.d42d57a7722e46b39b28.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-931168cd.8da81c81cb48dce02f91.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-96c26e23.0d86599e13ef18e65377.min.js",revision:null},{url:"https://erichsia7.github.io/pwdgen2/dist/main-a9a05081.f40548a3a5ddcee514f6.min.js",revision:null}],{}),i.registerRoute(/^https:\/\/fonts.googleapis.com/,new i.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
