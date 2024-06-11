// ==UserScript==
// @name         Transmission-ScrollBar
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Hueizhi
// @match        http://orangepizero2:9091/transmission/web/
// @icon         https://raw.githubusercontent.com/johman10/flood-for-transmission/master/public/images/flood.svg
// @downloadURL  https://github.com/863056768/user-script/raw/main/transmission/Transmission-ScrollBar.user.js
// @updateURL    https://github.com/863056768/user-script/raw/main/transmission/Transmission-ScrollBar.user.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(
  `::-webkit-scrollbar{width:8px;height:8px;}::-webkit-scrollbar-button{width:0px;height:0px;}::-webkit-scrollbar-corner{background-color:transparent;}::-webkit-scrollbar-thumb{background-color:rgb(36 76 122);border-radius:6px;}::-webkit-scrollbar-track-piece{background-color:transparent;border-radius:6px;}`
);
