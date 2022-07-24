// ==UserScript==
// @name         Freshmeat Add to Transmission
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       Hueizhi
// @match        http*://freshmeat.io/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freshmeat.io
// @grant        GM_xmlhttpRequest
// @connect      orangepizero2
// @connect      192.168.1.147
// ==/UserScript==

(function () {
    installButton();
})();

function waitButton() {
    while (true) {
        setTimeout(() => {}, 10);
        try {
            if (document.getElementsByClassName("btn-outline-primary").length > 0) {
                break;
            }
        } catch (err) {
            console.error("Add to Transmission Script Error: " + err);
        }
    }
}

function installButton() {
    /*-------------------------------*/
    var ele = document.createElement("style");
    ele.innerHTML = `.torrent-add {
  background-color: #375a7f;
  border-color: #375a7f;
  border:1px solid transparent;
  border-radius: 1.25rem;
  outline: none;
  color: white;
  padding: 0.375rem 0.75rem;
}`;
    document.head.append(ele);
    /*-------------------------------*/

    var fn = document.getElementsByClassName("btn-outline-primary")[0].href;
    var btn = document.getElementsByClassName("btn-outline-warning")[0];
    var currentNode = btn.parentNode;
    var nbtn = document.createElement("button");
    nbtn.type = "button";
    nbtn.className = "torrent-add";
    nbtn.innerHTML = "<b>Add to Transmission</b>";

    //  waitButton();

    btn.remove();
    nbtn.addEventListener(
        "click",
        () => {
            sendMagnetEvent(fn, nbtn);
        },
        { once: true }
    );
    currentNode.appendChild(nbtn);
}

async function sendMagnetEvent(fn, btn) {
    try {
        btn.innerHTML = "<b>Sending...</b>";
        let session = await getSession();
        let res = await sendFileName(session, fn);
        btn.innerHTML = "<b>Done</b>";
    } catch (error) {
        btn.innerHTML = "<b>Failed</b>";
        console.log("失败");
        console.log(error);
    }
}

function getSession() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "post",
            url: "http://orangepizero2:9091/transmission/rpc",
            data: JSON.stringify({ method: "session-get" }),
            onload: res => {
                if (res.status === 409) {
                    console.log("获取Session成功");
                    resolve(
                        getHeadersMap(res.responseHeaders)["x-transmission-session-id"]
                    );
                } else {
                    reject(res);
                }
            },
            onerror: err => {
                reject(err);
            },
        });
    });
}

function sendFileName(session, fn) {
    return new Promise((resolve, reject) => {
        var date = new Date();
        GM_xmlhttpRequest({
            method: "post",
            url: "http://orangepizero2:9091/transmission/rpc",
            data: JSON.stringify({
                arguments: {
                    filename: fn,
                    "download-dir":
                    "/downloads/jav/" +
                    date.getFullYear().toString().padStart(4, "0") +
                    "-" +
                    (date.getMonth()+1).toString().padStart(2, "0") +
                    "-" +
                    date.getDate().toString().padStart(2, "0"),
                },
                method: "torrent-add",
            }),
            headers: { "X-Transmission-Session-Id": session },
            onload: res => {
                if (res.status === 200) {
                    console.log("磁链发送成功");
                    resolve(getHeadersMap(res.responseHeaders).result);
                } else {
                    reject(res);
                }
            },
            onerror: err => {
                reject(err);
            },
        });
    });
}

function getHeadersMap(headers) {
    var arr = headers.trim().split(/[\r\n]+/);
    var headerMap = {};
    arr.forEach(function (line) {
        var parts = line.split(": ");
        var header = parts.shift();
        var value = parts.join(": ");
        headerMap[header] = value;
    });
    return headerMap;
}
