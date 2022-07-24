// ==UserScript==
// @name         CountryAbbr
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @match        https://olympics.com/tokyo-2020/olympic-games/*
// @icon         https://www.google.com/s2/favicons?domain=olympics.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==


// 国家简称 = 国家简称 + ' ' + 国家名称
(function() {
    'use strict';

    // Your code here...
    function abbr() {
        var noc = $('.noc');
        for (i of noc) {
            i.innerText = i.innerText + ' ' + i.title
        };
    };
    setTimeout(abbr,5000)
})();