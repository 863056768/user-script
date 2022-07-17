// ==UserScript==
// @name         Socialbearing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://*.socialbearing.com/*
// @icon         https://www.google.com/s2/favicons?domain=socialbearing.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function display() {
        let sen = $('.sen_overlay');
        for (var i=0;i<sen.length;i++)
        {
        sen[i].style.cssText='display: none;'
        }
        console.log(`${sen.length}done`)}
    setInterval(display,1000)
})();