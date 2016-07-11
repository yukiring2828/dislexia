# SpeedWathing Chrome拡張機能

YouTube動画の再生速度を変更し高速視聴を実現する。

## 設定

config.js

SpeedwatchingサーバのURLにhostに設定する。
manifest.jsonの"permissions"にも追加する。

## ビルド方法

Chromeを使う方法とRubyを使う方法がある。

* Chromeを使う場合は、chrome://extensions/を開いて、"拡張機能のパッケージ化"
* Rubyを使う場合はcrxmakeをインストールして(gem install crxmake)、browser_extensions/build.shを実行する。

speedwatching_ext_chrome.crx, speedwatching_ext_chrome.zip ができる。
crxファイルはabout:chromeにドラッグドロップするとインストールできる。zipはChromeWebStoreへアップロードするのに使う。

## 構成

* bg.js : バックグラウンド処理。設定の保存と読み込み、操作履歴のアップロード
* config.js : 設定
* content_youtube.js : youtube.com用コンテントスクリプト 
* locale.js : 多言語化機能を適用
* ui.js : ユーザの操作をcontent_youtube.jsに送る
* util.js : ユーティリティ

## 動作

* YouTubeの動画ページを開くとcontent_youtube.jsが実行される。
* content_youtube.jsはサーバにアクセスして解析データがあるかを確認。
* データがない場合は「SpeedWatchingに登録する」リンクを表示。
* データがある場合は、300millisecのループを回して、再生位置を取得、再生スピードの設定を繰り返す。
* またcontent_youtube.jsは高速試聴用のUI(ui.html)をiframeで追加する
* 速度調整のスライダーやスキップバックボタンはこのui.htmlにある
* ui.htmlの中でui.jsが読み込まれ、ui.jsがスライダーやボタンの操作をハンドルしてcontent_youtbe.jsに送信する
* content_youtube.jはui.jsから送られてきた操作情報をもとに動画の速度を変更する。
* それと同時に操作履歴をbg.jsへ送信する。bg.jsそれをサーバへ送信する。
