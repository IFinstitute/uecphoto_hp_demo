(function () {
    // NOTE: ここに表示したい note の RSS URL を入れてください（例: "https://note.com/your_account/rss"）
    const feedUrl = "https://note.com/uec_photo/rss";
    const api = "https://api.allorigins.win/raw?url=" + encodeURIComponent(feedUrl);
    const target = document.getElementById('blog');

    async function fetchRSS() {
        try {
            const res = await fetch(api);
            if (!res.ok) throw new Error("Failed to fetch RSS");
            const text = await res.text();
            // console.log('Fetched RSS text:', text);
            const doc = new DOMParser().parseFromString(text, "application/xml");
            const items = Array.from(doc.querySelectorAll("item")).slice(0, 3);
            if (items.length === 0) {
                target.innerHTML = '<div style="color:var(--muted)">投稿が見つかりませんでした。</div>';
                return;
            }
            target.innerHTML = "";
            items.forEach(it => {
                // const thumb = it.querySelector("media:thumbnail")?.textContent || "/wp/wp-content/uploads/2018/04/0d40a5e4a645fc6b96e767d64ac0878e-300x249.jpg";
                const title = it.querySelector("title")?.textContent || "無題";
                const link = it.querySelector("link")?.textContent || "#";
                // const pub = it.querySelector("pubDate")?.textContent || "";
                const pubRaw = it.querySelector("pubDate")?.textContent || "";
                function pad(n) { return String(n).padStart(2, '0'); }
                const weekdayShortJa = ['日', '月', '火', '水', '木', '金', '土'];
                function formatDate(d, fmt) {
                    return fmt.replace(/YYYY|MM|DD|HH|mm|ss|ddd/g, token => {
                        switch (token) {
                            case 'YYYY': return d.getFullYear();
                            case 'MM': return pad(d.getMonth() + 1);
                            case 'DD': return pad(d.getDate());
                            case 'HH': return pad(d.getHours());
                            case 'mm': return pad(d.getMinutes());
                            case 'ss': return pad(d.getSeconds());
                            case 'ddd': return weekdayShortJa[d.getDay()];
                        }
                    });
                }
                // 例：希望の表示形式をここで変更
                const FORMAT = 'YYYY年MM月DD日 (ddd) HH:mm';
                let pub = "";
                if (pubRaw) {
                    const d = new Date(pubRaw);
                    if (!isNaN(d)) {
                        pub = formatDate(d, FORMAT)
                    } else {
                        pub = pubRaw;
                    }
                }

                const el = document.createElement("a");
                el.className = "post";
                el.href = link;
                el.target = "_blank";
                el.rel = "noopener noreferrer";

                // HTML を組み立て（サムネイルがあれば先頭に挿入）
                let html = '<div class="title">' + title + '</div><div class="date">' + pub + '</div>';
                el.innerHTML = html;
                target.appendChild(el);
            });
        } catch (err) {
            target.innerHTML = '<div style="color:var(--muted)">最新記事の取得に失敗しました。時間をおいて再読み込みしてください。</div>';
            console.error(err);
        }
    }

    fetchRSS();
})();

