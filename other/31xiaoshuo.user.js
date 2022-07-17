// ==UserScript==
// @name         31xiaoshuo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://*.31xiaoshuo.com/*/*
// @match        *://*.230book.com/*
// @icon         https://www.google.com/s2/favicons?domain=31xiaoshuo.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let eleStyle = document.createElement('style');
    eleStyle.innerHTML += `
        .ywtop { background-color: #111 !important;
                 border-bottom: #111 !important;}
        #content p { text-indent: 2em ;
                     font-size: 15px ;
                     letter-spacing: 0.05em ;
                     padding: 5px;
                     color: #888;}
        `;
    document.head.appendChild(eleStyle);
})();