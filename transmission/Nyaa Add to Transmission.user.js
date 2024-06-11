// ==UserScript==
// @name         Nyaa Add to Transmission
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       Hueizhi
// @match        https://nyaa.si/*
// @match        https://sukebei.nyaa.si/*
// @match        https://u9a9.com/*
// @exclude      https://nyaa.si/upload*
// @exclude      https://sukebei.nyaa.si/upload*
// @exclude      https://u9a9.com/upload*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL  https://github.com/863056768/user-script/raw/main/transmission/Nyaa%20Add%20to%20Transmission.user.js
// @updateURL    https://github.com/863056768/user-script/raw/main/transmission/Nyaa%20Add%20to%20Transmission.user.js
// @connect      orangepizero2
// @connect      192.168.1.147
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addElement
// ==/UserScript==

GM_addElement;
const defaultDownloadDir = "/downloads/nyaa.si/";
let downloadDir = GM_getValue("downloadDir", defaultDownloadDir);
const rpcBind = "http://orangepizero2:9091/transmission/rpc";

const $ = window.jQuery;
const isView = location.href.includes("nyaa.si/view");
var session_id = await getSessionID();
setInterval(refreshSessionID, 5 * 60 * 1000);

$(document).ready(installButton);
function installButton() {
  addStyle();
  installDownloadDirSetter();
  if (isView) {
    console.log("install button on view");
    installButtonOnView();
  } else {
    console.log("install button on table");
    installButtonOnTable();
  }
}

function addStyle() {
  GM_addStyle(`
    .torrent-add {
        background-color: transparent;
        border-color: transparent;
        border: 1px solid transparent;
        border-radius: 0.75rem;
        outline: none;
        cursor: pointer;
    }

    .hdr-link.text-center{
        width: 13ch!important;
    }

    #loading {
        background-color: #375a7f;
        border: 4px solid #f3f3f3;
        border-top-color: #555;
        border-radius: 100%;
        width: 27px;
        height: 27px;
        display: inline-block;
        animation: spin 2s linear infinite;
    }
    #loaded {
        display: inline-block;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(1080deg);
        }
    }
    `);
}

function installDownloadDirSetter() {
  const navbar = document.getElementById("navbar");
  const btn = document.createElement("a");
  const li = document.createElement("li");
  li.append(btn);
  btn.innerText = "下载目录: " + downloadDir;
  btn.style.cursor = "pointer";
  btn.addEventListener("click", () => {
    let newDownloadDir = prompt(
      "请输入下载目录\n留空使用默认目录",
      "/HDD/BanGDream"
    ).trim();
    if (newDownloadDir === "") {
      newDownloadDir = defaultDownloadDir;
    }
    GM_setValue("downloadDir", newDownloadDir);
    downloadDir = newDownloadDir;
    btn.innerText = "下载目录: " + newDownloadDir;
  });

  navbar.querySelector("ul").appendChild(li);
}

function installButtonOnTable() {
  let rows = $(".torrent-list>tbody>tr");
  for (let row of rows) {
    let btn = document.createElement("button");
    let magenet = row.children[2].children[1].href;
    btn.className = "torrent-add";
    btn.innerText = "🧲";
    row.children[2].innerHTML = "";
    row.children[2].append(btn);
    btn.addEventListener("click", () => {
      sendMagnetEvent(magenet, btn, { once: true });
    });
  }
}

function installButtonOnView() {
  let submitDiv = document.createElement("div");
  submitDiv.className = "panel-footer clearfix";
  submitDiv.innerHTML = `
        <a class="torrent-add"><i class="fa fa-download fa-fw"></i>Send Torrent</a> or
        <a class="torrent-add"><i class="fa fa-magnet fa-fw"></i>Send Magnet</a>`;
  let torrentBtn = submitDiv.children[0];
  let magnetBtn = submitDiv.children[1];

  let div = $("div.panel-footer.clearfix")[0];
  div.parentElement.append(submitDiv);
  let url = div.children[0].href;
  let magnet = div.children[1].href;
  torrentBtn.addEventListener("click", () => {
    sendTorrentEvent(url, torrentBtn, { once: true });
  });
  magnetBtn.addEventListener("click", () => {
    sendMagnetEvent(magnet, magnetBtn, { once: true });
  });
}

function sendMagnetEvent(magnet, btn) {
  btn.innerHTML = "<b>Sending...</b>";
  sendMagnet(magnet)
    .then((res) => {
      btn.innerHTML = "<b>Done</b>";
      console.log(`[${res}]磁链`, parseMagnet(magnet, "dn")[0], "发送成功");
    })
    .catch((err) => {
      btn.innerHTML = "<b>Failed</b>";
      console.error("[fail]磁链发送失败", err);
    });
}

function sendTorrentEvent(url, btn) {
  btn.innerHTML = "<b>Sending...</b>";
  getTorrent(url)
    .then((resp) => toBase64(resp))
    .then((metainfo) => sendTorrent(metainfo))
    .then((res) => {
      btn.innerHTML = "<b>Done</b>";
      console.log(`[${res}]文件发送成功`);
    })
    .catch((err) => {
      btn.innerHTML = "<b>Failed</b>";
      console.error("[fail]文件发送失败", err);
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
          let session_id = getHeadersMap(res.responseHeaders)[
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

function getTorrent(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      responseType: "blob",
      onload: (resp) => {
        if (resp.status === 200) {
          resolve(resp.response);
        } else {
          reject(resp);
        }
      },
      onerror: (err) => {
        reject(err);
      },
    });
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
}

function sendTorrent(metainfo) {
  return new Promise((resolve, reject) => {
    let data = {
      arguments: {
        metainfo: metainfo,
        paused: false,
        "download-dir":
          downloadDir === defaultDownloadDir
            ? downloadDir + today()
            : downloadDir,
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
          "download-dir":
            downloadDir === defaultDownloadDir
              ? downloadDir + today()
              : downloadDir,
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

function getHeadersMap(headers) {
  return Object.fromEntries(
    headers
      .trim()
      .split(/[\r\n]+/)
      .map((line) => line.split(":", 2).map((s) => s.trim()))
  );
}

function parseMagnet(magnet, key) {
  let usp = new URLSearchParams(magnet);
  return usp.getAll(key);
}

function today() {
  let date = new Date();
  return (
    date.getFullYear().toString().padStart(4, "0") +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
}
