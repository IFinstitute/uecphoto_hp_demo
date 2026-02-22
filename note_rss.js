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
            const doc = new DOMParser().parseFromString(text, "application/xml");
            const items = Array.from(doc.querySelectorAll("item")).slice(0, 3);
            if (items.length === 0) {
                target.innerHTML = '<div style="color:var(--muted)">投稿が見つかりませんでした。</div>';
                return;
            }
            target.innerHTML = "";
            items.forEach(it => {
                const title = it.querySelector("title")?.textContent || "無題";
                const link = it.querySelector("link")?.textContent || "#";
                // const pub = it.querySelector("pubDate")?.textContent || "";
                const pubRaw = it.querySelector("pubDate")?.textContent || "";
                let pub = "";
                if (pubRaw) {
                    const d = new Date(pubRaw);
                    if (!isNaN(d)) {
                        d.setHours(d.getHours() + 9);
                        pub = d.toLocaleString('ja-JP', {
                            timeZone: 'Asia/Tokyo',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            weekday: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).replace(/\u200E/g, ''); // remove any stray LTR mark
                    } else {
                        pub = pubRaw;
                    }
                }
                const el = document.createElement("a");
                el.className = "post";
                el.href = link;
                el.target = "_blank";
                el.rel = "noopener noreferrer";
                el.innerHTML = '<div class="title">' + title + '</div><div class="date">' + pub + '</div>';
                target.appendChild(el);
            });
        } catch (err) {
            target.innerHTML = '<div style="color:var(--muted)">最新記事の取得に失敗しました。時間をおいて再読み込みしてください。</div>';
            console.error(err);
        }
    }

    fetchRSS();
})();

