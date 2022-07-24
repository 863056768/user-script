// ==UserScript==
// @name         Bilibili Card-Box Expand
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var ele = document.createElement('style')
    ele.innerHTML=`
    .video-page-card .card-box .info .title {
        overflow: visible;
        -webkit-line-clamp: unset;
        height: auto;
        display:content;
    }`
    document.head.append(ele)
    // Your code here...
})();