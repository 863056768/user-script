// ==UserScript==
// @name         Mikanani.me Add to Transmission
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  try to take over the world!
// @author       Hueizhi
// @match        https://mikanani.me/*
// @exclude      https://mikanani.me
// @exclude      https://mikanani.me/Account/*
// @exclude      https://mikanani.me/Home/PublishGroup/*
// @exclude      https://mikanani.me/RSS/*
// @exclude      https://mikanani.me/Home/Contact
// @exclude      https://mikanani.me/Home/Publish
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mikanani.me
// @downloadURL  https://github.com/863056768/user-script/raw/main/transmission/Mikanani%20Add%20to%20Transmission.user.js
// @updateURL    https://github.com/863056768/user-script/raw/main/transmission/Mikanani%20Add%20to%20Transmission.user.js
// @connect      orangepizero2
// @connect      192.168.1.147
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

const downloadDir = "/downloads/mikanani.me/";
const rpcBind = "http://orangepizero2:9091/transmission/rpc";
const isEpisode = location.href.startsWith("https://mikanani.me/Home/Episode");
//Array.from(document.querySelectorAll(".episode-expand")).map(a => a.addEventListener("click", installButton));

function installButton() {
  addStyle();
  if (isEpisode) {
    console.log("install button on episode");
    installButtonOnEpisode();
  } else {
    console.log("install button on table");
    installButtonOnTable();
  }
}

/**
 * @typedef {Object} Torrent
 * @property {string} hashString
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} TorrentAddAnswer
 * @property {?Torrent} torrent-added
 * @property {?Torrent} torrent-duplicate
 * @property {string} result
 */

class TransmissionSession {
  constructor() {
    /** @type {number} */
    this.lastRequestTime = 0;
    /** @type {?string} */
    this.sessionId = null;
  }

  /**
   * @returns {Promise<string>}
   */
  get id() {
    return this.sessionId && Date.now() - this.lastRequestTime < 300000
      ? Promise.resolve(this.sessionId)
      : this.refreshSessionID();
  }

  /**
   * @param {string} sessionId
   */
  set id(sessionId) {
    this.sessionId = sessionId;
    this.lastRequestTime = Date.now();
  }

  /**
   * @returns {Promise<string>}
   */
  refreshSessionID() {
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
            this.lastRequestTime = Date.now();
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
}

class TransmissionClient {
  constructor() {
    this.session = new TransmissionSession();
  }

  /**
   * @function
   * @param {string} url
   * @returns {Promise<TorrentAddAnswer>}
   */
  async torrentAddURL(url) {
    const sid = await this.session.id.catch((err) => {
      throw err;
    });
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: rpcBind,
        data: JSON.stringify({
          arguments: {
            filename: url,
            "download-dir": downloadDir + today(),
          },
          method: "torrent-add",
        }),
        headers: {
          "X-Transmission-Session-Id": sid,
          "Content-Type": "application/json",
        },
        onload: (res) => {
          if (res.status === 200) {
            resolve(JSON.parse(res.response));
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
}

const client = new TransmissionClient();

function addStyle() {
  GM_addStyle(
    `.transmission-td {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.transmission-td > button + button {
  margin-left: 4px;
}

.btn-warning {
  background-color: #eec445;
  border-color: #eec445;
}

.container {
  max-width: 100vw;
}

.episode-btn {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}
.episode-btn > i {
  position: absolute;
  margin-left: -80px;
}`
  );
}

/**
 * @function
 * @param {string} btnStyle
 * @param {string} icon
 * @param {(btn: HTMLButtonElement) => Promise<boolean>} handler
 * @returns {(this: HTMLButtonElement, ev: MouseEvent) => any}
 */
const newBtnEventHandler = function (btnStyle, icon, handler) {
  return async function (ev) {
    if (this.classList.contains("active")) return;
    this.classList.add("active");
    const li = this.children[0];
    li.classList.replace(icon, "fa-spinner");
    li.classList.add("fa-pulse");

    if (await handler(this)) {
      this.classList.replace(btnStyle, "btn-success");
    } else {
      this.classList.replace(btnStyle, "btn-danger");
    }

    li.classList.remove("fa-pulse");
    li.classList.replace("fa-spinner", icon);
  };
};

/**
 * @type {(btn: HTMLButtonElement) => Promise<boolean>}
 */
const magnetBtnEventHandler = newBtnEventHandler(
  "btn-info",
  "fa-magnet",
  (btn) => {
    const url = btn.parentNode.parentNode
      .querySelector(".magnet-link")
      .getAttribute("data-clipboard-text");
    if (!url) Promise.reject("url not found");
    return torrentAddURLHandler(url);
  }
);

/**
 * @type {(btn: HTMLButtonElement) => Promise<boolean>}
 */
const torrentBtnEventHandler = newBtnEventHandler(
  "btn-warning",
  "fa-file",
  (btn) => {
    const url =
      btn.parentNode.parentNode.querySelector("td:last-of-type a").href;
    if (!url) Promise.reject("url not found");
    return torrentAddURLHandler(url);
  }
);

function installButtonOnTable() {
  const installButton = (table) => {
    if ([...table.querySelectorAll("thead > tr > th")].some(th => th.textContent.trim() === "添加")) {
      return;
    }
    const tbody = table.querySelector("tbody");
    const th = document.createElement("th");
    th.textContent = "添加";
    table.querySelector("thead>tr").prepend(th);
    tbody.querySelectorAll("tr").forEach((tr) => {
      // const magnet = tr.querySelector(".magnet-link").getAttribute("data-clipboard-text")
      // const url = tr.querySelector("td:nth-child(5)>a").href
      const td = document.createElement("td");
      td.className = "transmission-td";
      const magnetBtn = document.createElement("button");
      const torrentBtn = document.createElement("button");
      magnetBtn.className = "btn btn-info";
      torrentBtn.className = "btn btn-warning";
      magnetBtn.innerHTML = '<i class="fa fa-magnet"></i>';
      torrentBtn.innerHTML = '<i class="fa fa-file"></i>';

      td.append(magnetBtn, torrentBtn);
      tr.prepend(td);
      magnetBtn.addEventListener("click", magnetBtnEventHandler);
      torrentBtn.addEventListener("click", torrentBtnEventHandler);
    });
  };
  const tables = document.querySelectorAll("table");
  tables.forEach(installButton);

  const observer = new MutationObserver((mutationsList, observer) =>
    mutationsList.forEach((mutation) =>
      installButton(mutation.target.previousElementSibling)
    )
  );
  document
    .querySelectorAll(".episode-expand")
    .forEach((targetNode) =>
      observer.observe(targetNode, { attributes: true })
    );
}

function installButtonOnEpisode() {
  const nav = document.querySelector("div.leftbar-nav");
  const torrent = nav.children[0].href;
  const magnet = nav.children[1].href;
  const torrentBtn = document.createElement("button");
  const magnetBtn = document.createElement("button");
  torrentBtn.className = "btn episode-btn btn-episode-btn";
  magnetBtn.className = "btn episode-btn btn-episode-btn";
  torrentBtn.innerHTML = '<i class="fa fa-file"></i><span> 发送种子</span>';
  magnetBtn.innerHTML = '<i class="fa fa-magnet"></i><span> 发送磁链</span>';

  nav.append(torrentBtn, magnetBtn);

  torrentBtn.addEventListener(
    "click",
    newBtnEventHandler("btn-episode-btn", "fa-file", (btn) =>
      torrentAddURLHandler(torrent)
    )
  );
  magnetBtn.addEventListener(
    "click",
    newBtnEventHandler("btn-episode-btn", "fa-magnet", (btn) =>
      torrentAddURLHandler(magnet)
    )
  );
}

/**
 * @async
 * @function
 * @param {string} url
 * @returns {Promise<boolean>}
 */
async function torrentAddURLHandler(url) {
  return new Promise((resolve, reject) => {
    client
      .torrentAddURL(url)
      .then((res) => {
        /** @type {Torrent} */
        let torrent;
        if ("torrent-added" in res) {
          torrent = res["torrent-added"];
        } else if ("torrent-duplicate" in res) {
          torrent = res["torrent-duplicate"];
        } else {
          return resolve(true);
        }

        torrent = res["torrent-add"];
        console.log(`[${res.result}]${torrent.name}`);
        return resolve(true);
      })
      .catch((err) => {
        console.error("[FAIL]", err);
        return resolve(false);
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

installButton();
