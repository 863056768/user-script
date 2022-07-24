// ==UserScript==
// @name         Transmission-ScrollBar
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @match        http://orangepizero2:9091/transmission/web/
// @icon         https://raw.githubusercontent.com/johman10/flood-for-transmission/master/public/images/flood.svg
// @grant        none
// ==/UserScript==

window.jQuery(document).ready(function() {
    'use strict';
    let ele = document.createElement("style")
    ele.innerHtml = `::-webkit-scrollbar{width:8px;height:8px;}::-webkit-scrollbar-button{width:0px;height:0px;}::-webkit-scrollbar-corner{background-color:transparent;}::-webkit-scrollbar-thumb{background-color:rgb(36 76 122);border-radius:6px;}::-webkit-scrollbar-track-piece{background-color:transparent;border-radius:6px;}`
    document.head.append(ele)
})();