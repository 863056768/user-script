// ==UserScript==
// @name         RemoveQECode
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @match        http*://mp.weixin.qq.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload=function(){
        var element = document.getElementsByClassName("qr_code_pc")[0]
        element.parentNode.removeChild(element);
    }
})();