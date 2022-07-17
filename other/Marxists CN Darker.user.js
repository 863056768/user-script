// ==UserScript==
// @name         Marxists CN Darker
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
        margin-inline: 20pt;
    }
    body {
        padding-left: 30px;
        padding-right: 30px;
        max-width: 680px;
        margin: auto;
        border: 2px solid hsl(0deg 0% 29%);
        background: #1c1c1d;
        color: #d9d9d9;
        font-weight: 340;
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
    h1, h2, h3, h4, h5 {
        color: rgb(236, 0, 0);
    }`
    document.head.append(ele)

})();