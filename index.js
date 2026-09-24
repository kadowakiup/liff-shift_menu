window.onload = async function () {
  // === 各種URLの設定 ===
  const NOTION_URL = "https://drive.google.com/file/d/1oisBWGDe7W8rKV02hdVlx90b-aE9whfa/view?usp=sharing";
  const CHECK_LIFF_URL = "https://liff.line.me/2009827198-LyTrVRFv"; 
  const SUBMIT_LIFF_URL = "https://liff.line.me/2009827198-MNhumUto";

  try {
    // 1. LIFFの初期化
    await liff.init({ liffId: "2009827198-1tNPTxFt" });

    // 2. ログインチェック
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 3. 各ボタンのクリック処理（マイページ関連の通信処理は削除しました）
    document.getElementById("btn-rules").addEventListener("click", () => {
      liff.openWindow({ url: NOTION_URL, external: false }); 
    });

    document.getElementById("btn-check").addEventListener("click", () => {
      window.location.href = CHECK_LIFF_URL;
    });

    document.getElementById("btn-submit").addEventListener("click", () => {
      window.location.href = SUBMIT_LIFF_URL;
    });

  } catch (err) {
    console.error("LIFF Init Error:", err);
    alert("初期化エラーが発生しました");
  }
};