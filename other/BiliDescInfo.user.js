// ==UserScript==
// @name         BiliDescInfo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let eleStyle = document.createElement('style');
    eleStyle.innerHTML += `
        .desc-info { color: #a5a5a5 !important; }
        .channel-name { color: #E8E8E8 !important;}
        `;
    document.head.appendChild(eleStyle);
})();