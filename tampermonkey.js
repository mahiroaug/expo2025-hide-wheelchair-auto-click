// ==UserScript==
// @name         Expo2025 – 車いす関連タイル非表示 & 空き枠なし非表示 & もっと見る自動クリック
// @namespace    expo2025-hide-wheelchair-auto-click
// @version      1.5
// @description  車いす関連タイルを隠し、空き枠がないタイルを隠し、「もっと見る」を尽きるまで自動で押す
// @match        https://ticket.expo2025.or.jp/event_search/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  /* ======= 設定 ======= */
  const KEYWORDS = [
    "車いす対応",
    "車いす使用者向け",
    "車いす専用",
    "車いす席",
    "車いす・補助犬同伴",
    "障がい者",
    "障害がある方向け",
  ];
  const CLICK_INTERVAL = 4000; // クリック間隔 ms
  const DEBUG = true; // デバッグログを有効化
  const HIDE_NO_AVAILABILITY = true; // 空き枠がないタイルを非表示にする
  const VERBOSE_LOGS = false; // 詳細なログを出力するかどうか

  /* ======= スタイル ======= */
  GM_addStyle(".hide-wheelchair{display:none!important;}");
  GM_addStyle(".hide-no-availability{display:none!important;}");

  /* ======= セレクタ ======= */
  const TITLE_SEL = 'span[class^="style_search_item_title__"]';
  const ROW_SEL = 'div[class^="style_search_item_row"]';
  const NO_AVAILABILITY_IMG = 'img[src*="calendar_none.svg"]';

  /* ======= 状態変数 ======= */
  let isRunning = true; // 自動クリックが実行中かどうか
  let clickCount = 0; // クリック回数
  let totalHiddenCount = 0; // 合計非表示タイル数
  let hiddenWheelchairCount = 0; // 車いす関連で非表示にしたタイル数
  let hiddenNoAvailabilityCount = 0; // 空き枠なしで非表示にしたタイル数
  let logBuffer = []; // 処理メッセージのバッファ
  let lastHideTime = 0; // 最後に非表示処理をした時間

  /* ======= デバッグ関数 ======= */
  function log(...args) {
    if (DEBUG) {
      if (VERBOSE_LOGS || args[0].startsWith("クリック")) {
        logBuffer.push(args.join(" "));
      }
    }
  }

  // 統計情報を出力
  function printStats(force = false) {
    if (DEBUG) {
      const now = Date.now();
      // 強制出力、ボタンクリック時、または前回の出力から5秒以上経過している場合に出力
      if (
        force ||
        logBuffer.includes("クリック実行") ||
        now - lastHideTime > 5000
      ) {
        const stats = [
          `クリック回数: ${clickCount}`,
          `非表示タイル合計: ${totalHiddenCount}件`,
          `車いす関連: ${hiddenWheelchairCount}件`,
          `空き枠なし: ${hiddenNoAvailabilityCount}件`,
        ];

        if (VERBOSE_LOGS && logBuffer.length > 0) {
          stats.push(`処理: ${logBuffer.join(", ")}`);
        }

        console.log(`[Expo2025スクリプト] ${stats.join(" | ")}`);

        // バッファをクリア
        logBuffer = [];
        lastHideTime = now;
      }
    }
  }

  /* ======= タイル非表示 ======= */
  function hideTiles(root = document) {
    // 車いす関連タイル非表示
    const titles = root.querySelectorAll(TITLE_SEL);
    let hiddenWheelchair = 0;
    titles.forEach((span) => {
      if (KEYWORDS.some((k) => span.textContent.includes(k))) {
        span.closest(ROW_SEL)?.classList.add("hide-wheelchair");
        hiddenWheelchair++;
      }
    });

    if (hiddenWheelchair > 0) {
      hiddenWheelchairCount += hiddenWheelchair;
      if (VERBOSE_LOGS) {
        log(`${hiddenWheelchair}件の車いす関連タイルを非表示`);
      }
    }

    // 空き枠なしタイル非表示
    if (HIDE_NO_AVAILABILITY) {
      const noAvailabilityTiles = root.querySelectorAll(NO_AVAILABILITY_IMG);
      let hiddenNoAvailability = 0;

      noAvailabilityTiles.forEach((img) => {
        const row = img.closest(ROW_SEL);
        if (row && !row.classList.contains("hide-wheelchair")) {
          row.classList.add("hide-no-availability");
          hiddenNoAvailability++;
        }
      });

      if (hiddenNoAvailability > 0) {
        hiddenNoAvailabilityCount += hiddenNoAvailability;
        if (VERBOSE_LOGS) {
          log(`${hiddenNoAvailability}件の空き枠なしタイルを非表示`);
        }
      }
    }

    totalHiddenCount = hiddenWheelchairCount + hiddenNoAvailabilityCount;

    // タイルを非表示にした場合は統計情報を更新する時間を記録
    if (hiddenWheelchair > 0 || hiddenNoAvailabilityCount > 0) {
      lastHideTime = Date.now();
    }

    // 統計情報を出力
    printStats();
  }

  /* ======= もっと見る自動クリック ======= */
  function findMoreButton() {
    // 「もっと見る」という完全一致テキストのボタンを探す
    const allButtons = Array.from(document.querySelectorAll("button"));
    return allButtons.find((btn) => {
      const text = (btn.textContent || btn.innerText).trim();
      return text === "もっと見る";
    });
  }

  function checkButtonState(btn) {
    if (!btn) {
      log("ボタン未検出");
      return false;
    }

    // ボタンの状態をチェック
    const isDisabled =
      btn.disabled ||
      btn.classList.contains("disabled") ||
      btn.getAttribute("aria-disabled") === "true" ||
      getComputedStyle(btn).opacity < 0.5;

    if (isDisabled) {
      log("非活性ボタン検出");
      isRunning = false;
      showCompletionMessage();
      return false;
    }

    log("クリック可能ボタン検出");
    return true;
  }

  function showCompletionMessage() {
    // 既存のメッセージがあれば削除
    const existingMsg = document.getElementById("expo-complete-msg");
    if (existingMsg) existingMsg.remove();

    // 完了メッセージを表示
    const completeMsg = document.createElement("div");
    completeMsg.id = "expo-complete-msg";
    completeMsg.textContent = `全ページ読み込み完了！（${clickCount}回クリック・合計${totalHiddenCount}件非表示、車いす関連:${hiddenWheelchairCount}件、空き枠なし:${hiddenNoAvailabilityCount}件）`;
    completeMsg.style.cssText =
      "position:fixed;top:10px;right:10px;background:#4CAF50;color:white;padding:10px;border-radius:5px;z-index:9999;font-weight:bold;";
    document.body.appendChild(completeMsg);

    // 最終統計をコンソールに出力
    console.log(
      `[Expo2025スクリプト] 完了！合計${clickCount}回クリックで${totalHiddenCount}件のタイルを非表示にしました（車いす関連:${hiddenWheelchairCount}件、空き枠なし:${hiddenNoAvailabilityCount}件）`
    );

    // 5秒後にメッセージを消す
    setTimeout(() => completeMsg.remove(), 5000);
  }

  function clickMore() {
    if (!isRunning) {
      log("停止済み");
      return;
    }

    const btn = findMoreButton();

    // ボタン状態を確認してクリック可能なら実行
    if (checkButtonState(btn)) {
      try {
        // クリック前にボタンの可視性を確認
        if (btn.offsetWidth > 0 && btn.offsetHeight > 0) {
          btn.click();
          clickCount++;
          log("クリック実行");
        }
      } catch (e) {
        log(`エラー: ${e.message}`);
      }

      // 統計情報を出力
      printStats(true);
    }

    // 自動クリックが実行中なら再試行
    if (isRunning) {
      setTimeout(clickMore, CLICK_INTERVAL);
    }
  }

  /* ======= 初回実行 ======= */
  console.log("[Expo2025スクリプト] 開始");
  hideTiles();

  // サイトの読み込みが完了してから自動クリック開始
  setTimeout(() => {
    log("自動クリック開始");
    printStats(true);
    clickMore();
  }, 1500);

  /* ======= 動的追加に対応 ======= */
  const obs = new MutationObserver((muts) => {
    muts.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) hideTiles(n);
      })
    );
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
