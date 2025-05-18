# EXPO2025 Pavilion & Event Filtering

A Tampermonkey script to streamline browsing of the Osaka-Kansai Expo (Expo2025) pavilion and event lottery application search page (2-month and 7-day advance lotteries).

## Execution Environment

- Chrome browser or any browser with the Tampermonkey extension installed

## Features

1. **Wheelchair-related Tile Hiding Function**

   - Automatically hides event tiles for wheelchair-accessible or disability-focused events
   - Detects using a customizable keyword list

2. **"See More" Automatic Click Function**
   - Automatically clicks the "See More" button to display all events
   - Automatically stops when the button becomes inactive
   - Displays statistical information upon completion

## Installation Method

1. Install the Tampermonkey browser extension

   - [Chrome version](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox version](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/)

2. Open the Tampermonkey dashboard and click "Add New Script"

3. Copy all contents of `tampermonkey.js` and paste them into the editor, then save

## How to Use

1. Access the official ticket site [https://ticket.expo2025.or.jp/event_search/](https://ticket.expo2025.or.jp/event_search/)

2. The script will automatically execute and perform the following actions:

   - Hide wheelchair-related tiles
   - Automatically click the "See More" button to load all events

3. Progress status (number of clicks, number of hidden tiles) will be displayed in the console log

## Customization

You can change the following settings in the script:

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
const CLICK_INTERVAL = 4000; // Click interval in ms
const DEBUG = true; // Enable debug logs
```

- `KEYWORDS`: List of keywords for tiles to hide
- `CLICK_INTERVAL`: Click interval (milliseconds)
- `DEBUG`: Enable/disable console logs

## Notes

- This script may stop working due to changes in the official site specifications
- Use of this script is **at your own risk**
- Excessive use of the script may place a load on the server, so please **set an appropriate click execution interval**

## License

MIT License
