// 대회 정산 페이지를 홈 화면 앱으로 설치했을 때 오프라인에서도 열리게 하는 서비스 워커
const CACHE = "settlement-v1";
const PAGE = "/settlement";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const response = await fetch(PAGE, { cache: "no-store" });
      const html = await response.clone().text();
      await cache.put(PAGE, response);
      // 페이지가 쓰는 JS/CSS/폰트를 미리 받아둔다
      const assets = [...new Set(html.match(/\/_next\/static\/[^"'\\\s)]+/g) ?? [])];
      await Promise.allSettled(assets.map((url) => cache.add(url)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // 빌드마다 이름이 바뀌는 정적 파일은 캐시 우선
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })()
    );
    return;
  }

  // 페이지 자체는 최신 버전을 먼저 받고, 오프라인이면 저장해둔 것을 보여준다
  if (request.mode === "navigate" && url.pathname === PAGE) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(PAGE, response.clone());
          return response;
        } catch {
          return (await cache.match(PAGE)) ?? Response.error();
        }
      })()
    );
  }
});
