// ==UserScript==
// @name         zhuixinfan
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @include        *://*.zhuixinfan.com/*
// @run-at document-idle
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    $('.bt.bt-cl')[0].href = $('#torrent_url').text();
    // for (var url of a) {
    //     console.log('href1: ' + url.href)
    //     var rp = $.ajax(url.href,{async: false})
    //     var pageText = rp.responseText;
    //     console.log('pageText: ' + pageText.slice(0,20))
    //     var magnet = $(pageText).find('#torrent_url').html();
    //     console.log('magnet:' + magnet.slice(0,20))
    //     url.href = magnet;
    //     console.log('href2:' + url.href.slice(0,20))
    //     };
})();