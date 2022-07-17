// ==UserScript==
// @name         Marxists EN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://www.marxists.org/*
// @exclude      *://www.marxists.org/chinese/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marxists.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var ele = document.createElement('style')
    ele.innerHTML=`
    body {
        background: #333333;
        color: #d9d9d9;
        font-weight: 340;
        max-width: 680px;
        margin: auto;
    }
    a:active, a:link, a:visited {
        color: lightslategray;
    }
    div.a3 {
        background-color: hsl(0deg 0% 15%);
    }
    DIV.border {
        BORDER: 2px solid hsl(0deg 0% 29%);
        BACKGROUND: #333333;
        padding-left: 30px;
        padding-right: 30px;
        max-width: 680px;
        margin: auto;
    }
    font[color="#003E00"] {
        color: hsl(120deg 53% 66%);
    }
    font[color="#000080"] {
        color: hsl(244deg 40% 62%);
    }
    h1, h2, h3, h4, h5 {
        color: rgb(236, 0, 0);
        margin-inline: 0em;
    }
    p {
        margin-inline: 0em;
    }`
    document.head.append(ele)

})();