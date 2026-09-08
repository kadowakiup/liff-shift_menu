window.onload = async function () {
  // === ★ご自身のURLに書き換えてください ===
  const NOTION_URL = "https://drive.google.com/file/d/1oisBWGDe7W8rKV02hdVlx90b-aE9whfa/view?usp=sharing";
  const CHECK_LIFF_URL = "https://liff.line.me/2009827198-LyTrVRFv"; 
  const SUBMIT_LIFF_URL = "https://liff.line.me/2009827198-MNhumUto";
  
  // ★CloudflareのAPIエンドポイント（WorkerのURL等）を指定してください
  const CLOUDFLARE_API_URL = "https://mypage.kadowaki-universal-prime.workers.dev/";

  try {
    // 1. LIFFの初期化
    await liff.init({ liffId: "2009827198-1tNPTxFt" });

    // 2. ログインチェック
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 3. ユーザー情報の取得 (Lark側の検索キーとしてLINE UserIDを使う場合)
    const profile = await liff.getProfile();
    const userId = profile.userId;

    // 4. Cloudflare(Anycross経由)からLarkのデータを取得して表示
    fetchLarkData(userId, CLOUDFLARE_API_URL);

    // 5. 各ボタンのクリック処理
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

// === Larkのデータを取得する関数 ===
async function fetchLarkData(userId, apiUrl) {
  const contentElement = document.getElementById("lark-data-content");

  try {
    // GETリクエストでCloudflareにリクエストを送信
    const response = await fetch(`${apiUrl}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Cloudflareから返ってきたJSONデータを取得
    const data = await response.json();

    // データをHTMLに表示する (※データ構造に合わせてプロパティ名を書き換えてください)
    // 例: { "status": "ok", "shiftInfo": "明日のシフトは10:00〜19:00です" }
    if (data.shiftInfo) {
      contentElement.style.color = "#333";
      contentElement.innerHTML = `<p>${data.shiftInfo}</p>`;
    } else {
      contentElement.innerHTML = `<p>表示する情報がありません。</p>`;
    }

  } catch (error) {
    console.error("Fetch Data Error:", error);
    contentElement.style.color = "red";
    contentElement.innerHTML = `<p>データの取得に失敗しました。</p>`;
  }
}