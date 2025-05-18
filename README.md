# EXPO2025 Pavilion & Event Filtering / EXPO2025 パビリオン・イベントフィルタリング

A Tampermonkey script to streamline browsing of the Osaka-Kansai Expo (Expo2025) pavilion and event lottery application search page (2-month and 7-day advance lotteries and 3-day advance first-come-first-served).

大阪・関西万博（Expo2025）のパビリオンやイベントの抽選申込検索ページ（2 ヶ月前抽選、7 日前抽選及び３日前先着）をスムーズに閲覧するための Tampermonkey スクリプトです。

## Execution Environment / 実行環境

- Chrome browser or any browser with the Tampermonkey extension installed
- Tampermonkey 拡張機能がインストールされている Chrome ブラウザまたは任意のブラウザ

## Features / 機能

1. **Wheelchair-related Tile Hiding Function / 車いす関連タイル非表示機能**

   - Automatically hides event tiles for wheelchair-accessible or disability-focused events
   - Detects using a customizable keyword list
   - 車いす専用枠または障がい者向けのイベントタイルを自動的に非表示にします
   - カスタマイズ可能なキーワードリストを使用して検出します

2. **No-Availability Tile Hiding Function / 空き枠なしタイル非表示機能**

   - Automatically hides event tiles that show no available spots (marked with X)
   - Identifies tiles using the "calendar_none.svg" image
   - 空き枠がないイベントタイル（X マークで表示）を自動的に非表示にします
   - "calendar_none.svg"画像を使用してタイルを識別します

3. **"See More" Automatic Click Function / 「もっと見る」自動クリック機能**
   - Automatically clicks the "See More" button to display all events
   - Automatically stops when the button becomes inactive
   - Displays statistical information upon completion
   - 「もっと見る」ボタンを自動的にクリックして、すべてのイベントを表示します
   - ボタンが非アクティブになると自動的に停止します
   - 完了時に統計情報を表示します

## Installation Method / インストール方法

1. Install the Tampermonkey browser extension / Tampermonkey ブラウザ拡張機能をインストールする

   - [Chrome version / Chrome 版](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox version / Firefox 版](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/)

2. Open the Tampermonkey dashboard and click "Add New Script" / Tampermonkey ダッシュボードを開き、「新規スクリプトを追加」をクリックする

3. Copy all contents of `tampermonkey.js` and paste them into the editor, then save / `tampermonkey.js`の内容をすべてコピーしてエディタに貼り付け、保存する

## How to Use / 使用方法

1. Access the official ticket site / 公式チケットサイトにアクセスする
   [https://ticket.expo2025.or.jp/event_search/](https://ticket.expo2025.or.jp/event_search/)

2. The script will automatically execute and perform the following actions / スクリプトは自動的に実行され、以下の動作を行います：

   - Hide wheelchair-related tiles / 車いす関連タイルを非表示にする
   - Hide tiles with no available spots / 空き枠がないタイルを非表示にする
   - Automatically click the "See More" button to load all events / 「もっと見る」ボタンを自動的にクリックしてすべてのイベントを読み込む

3. Progress status (number of clicks, number of hidden tiles) will be displayed in the console log / 進行状況（クリック数、非表示タイル数）がコンソールログに表示されます

## Customization / カスタマイズ

You can change the following settings in the script / スクリプト内で以下の設定を変更できます：

```javascript
const KEYWORDS = [
  "車いす対応",
  "車いす使用者向け",
  "車いす専用",
  "車いす席",
  "車いす・補助犬同伴",
  "障がい者",
  "障害がある方向け",
];
const CLICK_INTERVAL = 4000; // Click interval in ms / クリック間隔（ミリ秒）
const DEBUG = true; // Enable debug logs / デバッグログを有効にする
const HIDE_NO_AVAILABILITY = true; // Hide tiles with no available spots / 空き枠がないタイルを非表示にする
const VERBOSE_LOGS = false; // Enable detailed logs / 詳細なログを有効にする
```

- `KEYWORDS`: List of keywords for tiles to hide / 非表示にするタイルのキーワードリスト
- `CLICK_INTERVAL`: Click interval (milliseconds) / クリック間隔（ミリ秒）
- `DEBUG`: Enable/disable console logs / コンソールログの有効化/無効化
- `HIDE_NO_AVAILABILITY`: Enable/disable hiding of tiles with no available spots / 空き枠がないタイルの非表示の有効化/無効化
- `VERBOSE_LOGS`: Enable/disable detailed processing logs / 詳細な処理ログの有効化/無効化

## Notes / 注意事項

- This script may stop working due to changes in the official site specifications / 公式サイトの仕様変更により、このスクリプトは動作しなくなる可能性があります
- Use of this script is **at your own risk** / このスクリプトの使用は**自己責任**でお願いします
- Excessive use of the script may place a load on the server, so please **set an appropriate click execution interval** / スクリプトの過度な使用はサーバーに負荷をかける可能性があるため、**適切なクリック実行間隔を設定**してください

## License / ライセンス

MIT License / MIT ライセンス
