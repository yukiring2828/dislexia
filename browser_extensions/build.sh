#!/bin/sh

crxmake \
 -v \
 --pack-extension chrome \
 --ignore-file .DS_Store \
 --ignore-dir .git \
 --pack-extension-key chrome.pem \
 --zip-output speedwatching_ext_chrome.zip

crxmake \
 -v \
 --pack-extension chrome \
 --ignore-file .DS_Store \
 --ignore-dir .git \
 --pack-extension-key chrome.pem \
 --extension-output speedwatching_ext_chrome.crx

