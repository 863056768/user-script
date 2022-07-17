// ==UserScript==
// @name         RemoveAds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        http*://www.nfmovies.com/*
// @grant        none
// ==/UserScript==

setTimeout (function() {
    'use strict';

    // Your code here...
        $('.hidden-xs').slice(-1)[0].remove()
        for (let ad of $('.btnclose')) {
            ad.parentElement.remove()
        }
        for (let ad of $('.myui-ra-container')) {
            ad.remove()
        }
        $('.hy-layout')[0].remove()
}, 0);