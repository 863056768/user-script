// ==UserScript==
// @name         移除推荐直播间
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @match        *://www.douyu.com/directory/myFollow
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    $('.AthenaBoothPanel-wrapper').parentElement.parentElement.remove()

    // Your code here...
})();