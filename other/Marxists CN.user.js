// ==UserScript==
// @name         Marxists CN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://www.marxists.org/chinese/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marxists.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var ele = document.createElement('style')
    ele.innerHTML=`
    html {
        margin-inline: 2em;
    }
    body {
        font: 300 16px/1.8 -apple-system,PingFang SC,Microsoft Yahei,Lantinghei SC,Hiragino Sans GB,Microsoft Sans Serif,WenQuanYi Micro Hei,sans-serif;
        padding-left: 30px;
        padding-right: 30px;
        max-width: 680px;
        margin: auto;
        border: 2px solid hsl(0deg 0% 29%);
        background: #333333;
        color: #d9d9d9;
        font-weight: 340;
        line-height: 2;
    }
    a:active, a:link, a:visited {
        color: lightslategray;
    }
    div.a3 {
        background-color: hsl(0deg 0% 15%);
    }
    DIV.border {
        BORDER: #666666 0.5em solid;
        BACKGROUND: #333333;
    }
    font[color="#003E00"] {
        color: hsl(120deg 53% 66%);
    }
    font[color="#000080"] {
        color: hsl(244deg 40% 62%);
    }
    font[color="#000066"] {
        color: hsl(240deg 100% 87% / 70%);
    }
    h1, h2, h3, h4, h5 {
        color: rgb(236, 0, 0);
    }`
    document.head.append(ele)

})();