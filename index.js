window.onload = async function () {
  // === ★ご自身のURLに書き換えてください ===
  const NOTION_URL = "https://glowing-gastonia-33b.notion.site/36d4e26618db802dbd4ed0d7082907b4?source=copy_link";
  const CHECK_LIFF_URL = "https://liff.line.me/2009827198-LyTrVRFv"; // シフト確認 / 変更のLIFF URL
  const SUBMIT_LIFF_URL = "https://liff.line.me/2009827198-MNhumUto";

  try {
    // 1. LIFFの初期化（★このメニュー画面用に新しく作ったLIFF IDを指定します）
    await liff.init({ liffId: "新しいLIFF_IDをここに入力" });

    // 2. ログインチェック（念のため）
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 3. 各ボタンのクリック処理
    
    // ① 勤怠ルール（Notion）へ
    document.getElementById("btn-rules").addEventListener("click", () => {
      // NotionはLIFF内ブラウザのまま開く設定 (external: false)
      liff.openWindow({ url: NOTION_URL, external: false }); 
    });

    // ② シフト確認 / 変更 へ（別のLIFFへ）
    document.getElementById("btn-check").addEventListener("click", () => {
      // LIFFの中で別のLIFFを開く場合は window.location.href がスムーズです
      window.location.href = CHECK_LIFF_URL;
    });

    // ③ シフト一括提出 へ（別のLIFFへ）
    document.getElementById("btn-submit").addEventListener("click", () => {
      window.location.href = SUBMIT_LIFF_URL;
    });

  } catch (err) {
    console.error("LIFF Init Error:", err);
    alert("初期化エラーが発生しました");
  }
};