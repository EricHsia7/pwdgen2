if(!self.define){let e,t={};const i=(i,s)=>(i=new URL(i+".js",s).href,t[i]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=t,document.head.appendChild(e)}else e=i,importScripts(i),t()})).then((()=>{let e=t[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,o)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(t[n])return;let r={};const c=e=>i(e,n),d={module:{uri:n},exports:r,require:c};t[n]=Promise.all(s.map((e=>d[e]||c(e)))).then((e=>(o(...e),r)))}}define(["./workbox-03ee9729"],(function(e){"use strict";e.setCacheNameDetails({prefix:"pwdgen2-WTM1vqJVwwjAP13I"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"https://erichsia7.github.io/pwdgen2/index.css",revision:"4a353738e8e8b9f7adf7b825760a1df6"},{url:"https://erichsia7.github.io/pwdgen2/index.js",revision:"b03221adf376cfd4ef149b40476a8776"}],{}),e.registerRoute(/^https:\/\/fonts.googleapis.com/,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
