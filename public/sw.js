// Service Worker Minimalista para PWA
// O objetivo principal é permitir a instalação ("Add to Home Screen")

self.addEventListener('install', (event) => {
  // Força o SW a ativar imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Toma controle de todas as abas abertas imediatamente
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estratégia simples: tenta rede, se falhar, não faz nada (app online-first)
  // Isso evita erros de cache complexos e garante que o PWA seja detectado.
  event.respondWith(fetch(event.request));
});