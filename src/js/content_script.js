"use strict";


function downloadInjectAndTrigger() {
    if (typeof plxDwnld == 'undefined') {
        const jsCode = document.createElement('script');
        jsCode.setAttribute('src', 'https://piplong.run/plxdwnld/bookmarklet.js?v=0.3');
        document.body.appendChild(jsCode);
    } else {
        plxDwnld.init();
    }
}

function getMenuElement() {
    return document.querySelectorAll('[aria-label="More..."]')[0];
}

function injectDownloadButton(){
    // grab the menu element we want to place the button before
    let menuElement = getMenuElement();
    let elClone = menuElement.cloneNode(true);

    elClone.setAttribute('aria-label', 'Download File');
    elClone.id = 'downloader-button';
    elClone.onclick = downloadInjectAndTrigger;

    // download icon
    elClone.innerHTML = '<svg fill="hsla(0,0%,100%,.7)" style="margin-top:10px;width:23px" version="1.1" viewBox="0 0 1024 1024" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><polygon points="921.3 655.7 921.3 900.4 102.7 900.4 102.7 655.7 215.2 655.7 215.2 787.9 808.8 787.9 808.8 655.7"/><path d="m906.3 655.7v83.1 131.3 30.3l15-15h-21.9-59.7-87.8-107.6-117.8-118.5-110.9-93.8-67.4c-10.6 0-21.3-0.4-31.9 0h-1.3l15 15v-83.1-131.3-30.3l-15 15h98.7 13.8l-15-15v115.7 16.5c0 8.1 6.9 15 15 15h59.1 141.8 171.6 148.2c23.9 0 47.9 0.6 71.9 0h1c8.1 0 15-6.9 15-15v-115.7-16.5l-15 15h98.7 13.8c7.8 0 15.4-6.9 15-15s-6.6-15-15-15h-98.7-13.8c-8.1 0-15 6.9-15 15v115.7 16.5l15-15h-59.1-141.8-171.6-148.2-48.8c-7.7 0-15.4-0.4-23.1 0h-1l15 15v-115.7-16.5c0-8.1-6.9-15-15-15h-98.7-13.8c-8.1 0-15 6.9-15 15v83.1 131.3 30.3c0 8.1 6.9 15 15 15h21.9 59.7 87.8 107.6 117.8 118.5 110.9 93.8 67.4c10.6 0 21.3 0.2 31.9 0h1.3c8.1 0 15-6.9 15-15v-83.1-131.3-30.3c0-7.8-6.9-15.4-15-15-8.1 0.3-15 6.6-15 15z"/><polygon points="751.3 425.5 512 670.9 272.7 425.5 430 425.5 430 123.6 594 123.6 594 425.5"/><path d="m740.7 414.9c-7.9 8.1-15.9 16.3-23.8 24.4-19 19.5-38.1 39.1-57.1 58.6-23 23.6-46.1 47.3-69.1 70.9-19.9 20.4-39.9 40.9-59.8 61.3-9.6 9.9-20.1 19.4-29.1 29.8l-0.4 0.4h21.2c-7.9-8.1-15.9-16.3-23.8-24.4-19-19.5-38.1-39.1-57.1-58.6-23-23.6-46.1-47.3-69.1-70.9-19.9-20.4-39.8-40.9-59.8-61.3-9.6-9.9-18.9-20.5-29.1-29.8l-0.4-0.4c-3.5 8.5-7.1 17.1-10.6 25.6h137.7 19.5c8.1 0 15-6.9 15-15v-102.2-162.7-36.9l-15 15h144 20.1l-15-15v102.2 162.7 36.9c0 8.1 6.9 15 15 15h137.7 19.5c7.8 0 15.4-6.9 15-15s-6.6-15-15-15h-137.7-19.5l15 15v-102.2-162.7-36.9c0-8.1-6.9-15-15-15h-144-20.1c-8.1 0-15 6.9-15 15v102.2 162.7 36.9l15-15h-137.7-19.5c-13.1 0-19.6 16.3-10.6 25.6 7.9 8.1 15.9 16.3 23.8 24.4 19 19.5 38.1 39.1 57.1 58.6 23 23.6 46.1 47.3 69.1 70.9 19.9 20.4 39.8 40.9 59.8 61.3 9.7 9.9 19.1 20.3 29.1 29.8l0.4 0.4c5.6 5.7 15.6 5.8 21.2 0 7.9-8.1 15.9-16.3 23.8-24.4 19-19.5 38.1-39.1 57.1-58.6 23-23.6 46.1-47.3 69.1-70.9 19.9-20.4 39.9-40.9 59.8-61.3 9.7-9.9 19.7-19.6 29.1-29.8l0.4-0.4c5.7-5.8 5.8-15.4 0-21.2-5.7-5.7-15.5-5.9-21.2 0z"/></svg>';

    menuElement.parentNode.insertBefore(elClone, menuElement);
}

function injectionWrapper() {
    // we only want to inject on the media details page
    if (document.URL.includes('/details')) {
        // set an interval to check if the menu elemenet has rendered
        let checkExist = setInterval(function() {
          if (getMenuElement()) {
              clearInterval(checkExist);
              injectDownloadButton();
          }
        }, 100);
    }
}

window.addEventListener("hashchange", injectionWrapper, false);
injectionWrapper();
