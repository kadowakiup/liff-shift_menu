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
    const response = await fetch(`${apiUrl}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // data には画像の生データがそのまま入っています
    const data = await response.json();

    // ★ 修正ポイント：
    // data.body ではなく、data に直接アクセスして値を取得します
    const nqcId = data?.["Neo Quick Call"]?.value?.[0]?.text;
    const nqcPw = data?.["Neo Quick Call PW"]?.[0]?.text;

    if (nqcId || nqcPw) {
      // 読み込み中のセンタリングを解除
      contentElement.style.textAlign = "left"; 
      
      // シンプルな横並びのリスト風デザイン
      contentElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
          <span style="font-size: 12px; color: #888; letter-spacing: 0.5px;">ID</span>
          <strong style="font-size: 16px; color: #111; user-select: all; letter-spacing: 0.5px;">${nqcId || "未登録"}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px;">
          <span style="font-size: 12px; color: #888; letter-spacing: 0.5px;">Password</span>
          <strong style="font-size: 16px; color: #111; user-select: all; letter-spacing: 0.5px;">${nqcPw || "未登録"}</strong>
        </div>
      `;
    } else {
      contentElement.innerHTML = `
        <p style="color: #d9534f; font-size: 13px; font-weight: bold; margin-bottom: 4px;">データ構造が一致しませんでした</p>
        <p style="font-size: 11px; margin-bottom: 8px;">以下の生データを確認してください：</p>
        <div style="background:#eee; padding:8px; font-size:11px; word-break:break-all; max-height:200px; overflow-y:auto; border-radius:4px;">
          ${JSON.stringify(data)}
        </div>
      `;
    }

  } catch (error) {
    console.error("Fetch Data Error:", error);
    contentElement.style.color = "red";
    contentElement.innerHTML = `<p>データの取得に失敗しました。</p>`;
  }
}