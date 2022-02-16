/**
 * Download original files from the Plex web interface
 *
 * This project is licensed under the terms of the MIT license, see https://piplongrun.github.io/plxdwnld/LICENSE.txt
 *
 * @author      Pip Longrun <pip.longrun@protonmail.com>
 * @version     0.4
 * @see         https://piplongrun.github.io/plxdwnld/
 *
 */
"use strict";

if (typeof plxDwnld === "undefined") {

    window.plxDwnld = (function () {
        const self = {};
        const clientIdRegex = /server\/([a-f0-9]{40})\//;
        const metadataIdRegex = /key=%2Flibrary%2Fmetadata%2F(\d+)/;
        const apiResourceUrl = "https://plex.tv/api/resources?includeHttps=1&X-Plex-Token={token}";
        const apiLibraryUrl = "{baseuri}/library/metadata/{id}?X-Plex-Token={token}";
        const downloadUrl = "{baseuri}{partkey}?download=1&X-Plex-Token={token}";
        const accessTokenXpath = "//Device[@clientIdentifier='{clientid}']/@accessToken";
        const baseUriXpath = "//Device[@clientIdentifier='{clientid}']/Connection[@local='0' and not(@address='https')]/@uri";
        const partKeyXpath = "//Media/Part[1]/@key";
        let accessToken = null;
        let baseUri = null;

        const getXml = function (url, callback) {
            const request = new XMLHttpRequest();
            request.onload = () => {
                if (request.readyState == 4 && request.status == 200) {
                    callback(request.responseXML);
                } else {
                    alert("Unsuccessful XML URL: " + url);
                }
            };
            request.open("GET", url);
            request.send();
        };

        const getMetadata = function (xml) {
            const clientId = clientIdRegex.exec(window.location.href);

            if (clientId && clientId.length == 2) {
                const accessTokenNode = xml.evaluate(accessTokenXpath.replace("{clientid}", clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const baseUriNode = xml.evaluate(baseUriXpath.replace("{clientid}", clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                if (accessTokenNode.singleNodeValue && baseUriNode.singleNodeValue) {
                    accessToken = accessTokenNode.singleNodeValue.textContent;
                    baseUri = baseUriNode.singleNodeValue.textContent;
                    const metadataId = metadataIdRegex.exec(window.location.href);

                    if (metadataId && metadataId.length == 2) {
                        getXml(apiLibraryUrl.replace("{baseuri}", baseUri).replace("{id}", metadataId[1]).replace("{token}", accessToken), getDownloadUrl);
                    } else {
                        alert("Error while getting media id.");
                    }
                } else {
                    alert("Cannot find a valid accessToken.");
                }
            } else {
                alert("Error while getting client id.");
            }
        };

        const getDownloadUrl = function (xml) {
            const partKeyNode = xml.evaluate(partKeyXpath, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            if (partKeyNode.singleNodeValue) {
                window.location.href = downloadUrl.replace("{baseuri}", baseUri).replace("{partkey}", partKeyNode.singleNodeValue.textContent).replace("{token}", accessToken);
            } else {
                alert("Cannot start media download.");
            }
        };

        self.init = function () {
            if (typeof localStorage.myPlexAccessToken != "undefined") {
                getXml(apiResourceUrl.replace("{token}", localStorage.myPlexAccessToken), getMetadata);
            } else {
                alert("You are currently not browsing or logged into a Plex web environment.");
            }
        };

        return self;
    })();
}

const injectFunction = () => {
    console.log("Injecting...");

    // Create download arrow element
    const dl_button_span = document.createElement('span');
    dl_button_span.id = 'injected_download_button';
    dl_button_span.innerHTML = '<svg fill="hsla(0,0%,100%,.7)" style="width:23px" version="1.1" viewBox="0 0 1024 1024" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><polygon points="921.3 655.7 921.3 900.4 102.7 900.4 102.7 655.7 215.2 655.7 215.2 787.9 808.8 787.9 808.8 655.7"/><path d="m906.3 655.7v83.1 131.3 30.3l15-15h-21.9-59.7-87.8-107.6-117.8-118.5-110.9-93.8-67.4c-10.6 0-21.3-0.4-31.9 0h-1.3l15 15v-83.1-131.3-30.3l-15 15h98.7 13.8l-15-15v115.7 16.5c0 8.1 6.9 15 15 15h59.1 141.8 171.6 148.2c23.9 0 47.9 0.6 71.9 0h1c8.1 0 15-6.9 15-15v-115.7-16.5l-15 15h98.7 13.8c7.8 0 15.4-6.9 15-15s-6.6-15-15-15h-98.7-13.8c-8.1 0-15 6.9-15 15v115.7 16.5l15-15h-59.1-141.8-171.6-148.2-48.8c-7.7 0-15.4-0.4-23.1 0h-1l15 15v-115.7-16.5c0-8.1-6.9-15-15-15h-98.7-13.8c-8.1 0-15 6.9-15 15v83.1 131.3 30.3c0 8.1 6.9 15 15 15h21.9 59.7 87.8 107.6 117.8 118.5 110.9 93.8 67.4c10.6 0 21.3 0.2 31.9 0h1.3c8.1 0 15-6.9 15-15v-83.1-131.3-30.3c0-7.8-6.9-15.4-15-15-8.1 0.3-15 6.6-15 15z"/><polygon points="751.3 425.5 512 670.9 272.7 425.5 430 425.5 430 123.6 594 123.6 594 425.5"/><path d="m740.7 414.9c-7.9 8.1-15.9 16.3-23.8 24.4-19 19.5-38.1 39.1-57.1 58.6-23 23.6-46.1 47.3-69.1 70.9-19.9 20.4-39.9 40.9-59.8 61.3-9.6 9.9-20.1 19.4-29.1 29.8l-0.4 0.4h21.2c-7.9-8.1-15.9-16.3-23.8-24.4-19-19.5-38.1-39.1-57.1-58.6-23-23.6-46.1-47.3-69.1-70.9-19.9-20.4-39.8-40.9-59.8-61.3-9.6-9.9-18.9-20.5-29.1-29.8l-0.4-0.4c-3.5 8.5-7.1 17.1-10.6 25.6h137.7 19.5c8.1 0 15-6.9 15-15v-102.2-162.7-36.9l-15 15h144 20.1l-15-15v102.2 162.7 36.9c0 8.1 6.9 15 15 15h137.7 19.5c7.8 0 15.4-6.9 15-15s-6.6-15-15-15h-137.7-19.5l15 15v-102.2-162.7-36.9c0-8.1-6.9-15-15-15h-144-20.1c-8.1 0-15 6.9-15 15v102.2 162.7 36.9l15-15h-137.7-19.5c-13.1 0-19.6 16.3-10.6 25.6 7.9 8.1 15.9 16.3 23.8 24.4 19 19.5 38.1 39.1 57.1 58.6 23 23.6 46.1 47.3 69.1 70.9 19.9 20.4 39.8 40.9 59.8 61.3 9.7 9.9 19.1 20.3 29.1 29.8l0.4 0.4c5.6 5.7 15.6 5.8 21.2 0 7.9-8.1 15.9-16.3 23.8-24.4 19-19.5 38.1-39.1 57.1-58.6 23-23.6 46.1-47.3 69.1-70.9 19.9-20.4 39.9-40.9 59.8-61.3 9.7-9.9 19.7-19.6 29.1-29.8l0.4-0.4c5.7-5.8 5.8-15.4 0-21.2-5.7-5.7-15.5-5.9-21.2 0z"/></svg>';
    dl_button_span.style.cursor = 'pointer';
    dl_button_span.style.paddingLeft = '10px';

    // "Find the title" part
    const recurseChildren = (node, observer) => {
        if (node.nodeType == Node.ELEMENT_NODE) {
            if ((node.getAttribute("class") || "").includes("PrePlayLeftTitle")) {
                if (document.getElementById(dl_button_span.id) == null) { // avoids duplicating buttons because of async
                    observer.disconnect();
                    
                    node.firstElementChild.after(dl_button_span);
                    document.getElementById(dl_button_span.id).addEventListener("click", plxDwnld.init);
                
                    console.log("Injected!");
                }
            } else if (node.childNodes) {
                [...node.childNodes].forEach((child) => recurseChildren(child, observer));
            }
        }
    };

    new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            if (!mutation.addedNodes) return;

            // Doesn't work without recursivity, because MutationObserver doesn't check subtree of new nodes in addedNodes
            // See https://stackoverflow.com/a/61315048/12070367
            [...mutation.addedNodes].forEach((node) => recurseChildren(node, observer));
        });
    }).observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true
    });
}

window.onhashchange = () => injectFunction();

injectFunction(); // inject on first load too
