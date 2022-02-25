"use strict";

// Inject download script
const s = document.createElement("script");
s.src = chrome.runtime.getURL("js/download_script.js");
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
console.log("Download script injected.");
