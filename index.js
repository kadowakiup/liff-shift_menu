window.onload = async function () {
  // === 各種URLの設定 ===
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