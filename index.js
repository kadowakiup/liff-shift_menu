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

    const data = await response.json();

    // 対策：もし data.body が「文字列」として届いていた場合、JSONオブジェクトに変換する
    let responseBody = data.body;
    if (typeof responseBody === "string") {
      try {
        responseBody = JSON.parse(responseBody);
      } catch (e) {
        console.warn("bodyのJSONパースに失敗しました");
      }
    }

    // ご提示いただいた構造に合わせて取得
    const nqcId = responseBody?.["Neo Quick Call"]?.value?.[0]?.text;
    const nqcPw = responseBody?.["Neo Quick Call PW"]?.[0]?.text;

    if (nqcId || nqcPw) {
      contentElement.style.color = "#333";
      contentElement.innerHTML = `
        <div style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #ddd; margin-bottom: 8px;">
          <p style="margin: 0 0 8px 0; font-size: 15px;">
            <span style="color: #666; font-size: 12px; display: block;">ログインID</span>
            <strong style="user-select: all; letter-spacing: 1px;">${nqcId || "未登録"}</strong>
          </p>
          <p style="margin: 0; font-size: 15px;">
            <span style="color: #666; font-size: 12px; display: block;">パスワード</span>
            <strong style="user-select: all; letter-spacing: 1px;">${nqcPw || "未登録"}</strong>
          </p>
        </div>
        <p style="font-size: 12px; color: #888; margin: 0;">※文字を長押しするとコピーできます</p>
      `;
    } else {
      // ★ ここがポイント：値が取れなかった場合、LIFFが受け取った実際の生データを画面に表示します
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