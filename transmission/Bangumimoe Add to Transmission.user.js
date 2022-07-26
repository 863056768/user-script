// ==UserScript==
// @name         Bangumimoe Add to Transmission
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       Hueizhi
// @match        https://bangumi.moe/*
// @exclude      https://bangumi.moe/bangumi/list
// @exclude      https://bangumi.moe/rss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bangumi.moe
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @connect      orangepizero2
// @connect      192.168.1.147
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const downloadDir = "/downloads/bangumi.moe/";
const rpcBind = "http://orangepizero2:9091/transmission/rpc";

const $ = window.jQuery;
/** @type {string} */
var session_id = await getSessionID();
setInterval(refreshSessionID, 5 * 60 * 1000);

$(document).ready(observe);

function observe() {
    let observer = new MutationObserver(installButtonOnHomePage);
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
    });
}

function installButtonOnHomePage() {
    if (document.body.className.split(" ").includes("modal-open")) {
        addStyle();
        installButton();
    }
}

function addStyle() {
    let ele = document.createElement("style");
    ele.textContent = `
    .top-div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
    }

    .transmission-btn {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    `;
    document.head.append(ele);
}

function installButton() {
    /** @type {HTMLAnchorElement} */
    const titleLink = document.querySelector("md-dialog .title-link");
    /** @type {string} */
    const id = titleLink.href.split("/")[4];
    /** @type {string} */
    const title = titleLink.innerText;
    /** @type {HTMLDivElement} */
    const bar = document.querySelector(".md-actions");
    /** @type {string} */
    const magnet = bar.querySelector("a").href;

    const torrentBtn = document.createElement("button");
    const magnetBtn = document.createElement("button");

    torrentBtn.className = "md-primary md-button md-default-theme";
    magnetBtn.className = "md-warn md-button md-default-theme";

    torrentBtn.innerHTML =
        '<i class="fa fa-file ng-scope"></i><span class="ng-binding ng-scope"> Send Torrent</span>';
    magnetBtn.innerHTML =
        '<i class="fa fa-magnet ng-scope"></i><span class="ng-binding ng-scope"> 发送磁力链接</span>';

    // bar.append(torrentBtn, magnetBtn);
    const torrentDetailDiv = document.querySelector(".torrent-details-div");
    const topDiv = document.createElement("div");
    const transmissionDiv = document.createElement("div");
    topDiv.append(torrentDetailDiv.querySelector("div"), transmissionDiv);
    topDiv.className = "top-div";
    transmissionDiv.append(torrentBtn, magnetBtn);
    transmissionDiv.className = "transmission-btn";
    torrentDetailDiv.prepend(topDiv);

    torrentBtn.addEventListener("click", (event) => {
        sendTorrentEvent(id, title, event.currentTarget.lastElementChild);
    });
    magnetBtn.addEventListener("click", (event) => {
        sendMagnetEvent(magnet, event.currentTarget.lastElementChild);
    });
}

/**
 * @param {string} id
 * @param {string} title
 * @param {HTMLSpanElement} ele
 */
function sendTorrentEvent(id, title, ele) {
    ele.innerText = " Sending . . . . . .";
    /** @type {string} */
    const authUrl =
        "/download/torrent/" +
        id +
        "/" +
        title.replace(/[:<>\/\\\|\*\?"]/g, "_") +
        ".torrent";
    const URL = window.URL;
    /** @type {!HTMLAnchorElement} */
    const a = document.createElement("a");
    if (URL && "download" in a) {
        fetch(authUrl, {
            method: "GET",
            responseType: "blob",
        })
            .then((resp) => resp.blob())
            .then((blob) => toBase64(blob))
            .then((base64) => sendTorrent(base64))
            .then((res) => {
                ele.innerText = " DONE";
                console.log(`[${res}]文件发送成功`);
            })
            .catch((err) => {
                ele.innerText = " FAILED";
                console.error("[fail]文件发送失败", err);
            });
    } else {
        /** @type {string} */
        window.location = authUrl;
    }
}

/**
 * @param {string} magnet
 * @param {HTMLSpanElement} ele
 */
function sendMagnetEvent(magnet, ele) {
    ele.innerText = " Sending . . . . . .";
    sendMagnet(magnet)
        .then((res) => {
            ele.innerText = " DONE";
            console.log(
                `[${res}]磁链`,
                parseMagnet(magnet, "dn")[0],
                "发送成功"
            );
        })
        .catch((err) => {
            ele.innerText = " FAILED";
            console.error("[fail]磁链发送失败", err);
        });
}

function sendTorrent(metainfo) {
    return new Promise((resolve, reject) => {
        const data = {
            arguments: {
                metainfo: metainfo,
                paused: false,
                "download-dir": downloadDir + today(),
            },
            method: "torrent-add",
        };
        GM_xmlhttpRequest({
            method: "POST",
            url: rpcBind,
            data: JSON.stringify(data),
            headers: {
                "X-Transmission-Session-Id": session_id,
                "Content-Type": "application/json",
            },
            onload: (res) => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.response).result);
                } else {
                    reject(res);
                }
            },
            onerror: (err) => {
                reject(err);
            },
        });
    });
}

function sendMagnet(magnet) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: rpcBind,
            data: JSON.stringify({
                arguments: {
                    filename: magnet,
                    "download-dir": downloadDir + today(),
                },
                method: "torrent-add",
            }),
            headers: {
                "X-Transmission-Session-Id": session_id,
                "Content-Type": "application/json",
            },
            onload: (res) => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.response).result);
                } else {
                    reject(res);
                }
            },
            onerror: (err) => {
                reject(err);
            },
        });
    });
}

function getSessionID() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: rpcBind,
            data: JSON.stringify({ method: "session-get" }),
            onload: (res) => {
                if (res.status === 409) {
                    const session_id = getHeadersMap(res.responseHeaders)[
                        "x-transmission-session-id"
                    ];
                    console.log("获取Session ID成功:", session_id);
                    resolve(session_id);
                } else {
                    console.log("获取Session ID失败");
                    reject(res);
                }
            },
            onerror: (err) => {
                reject(err);
            },
        });
    });
}

async function refreshSessionID() {
    session_id = await getSessionID();
}

function toBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (event) => resolve(event.target.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
    });
}

function getHeadersMap(headers) {
    const arr = headers.trim().split(/[\r\n]+/);
    const headerMap = {};
    arr.forEach(function (line) {
        const parts = line.split(": ");
        const header = parts.shift();
        const value = parts.join(": ");
        headerMap[header] = value;
    });
    return headerMap;
}

function parseMagnet(magnet, key) {
    const usp = new URLSearchParams(magnet);
    return usp.getAll(key);
}

function today() {
    const date = new Date();
    return (
        date.getFullYear().toString().padStart(4, "0") +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getDate().toString().padStart(2, "0")
    );
}
