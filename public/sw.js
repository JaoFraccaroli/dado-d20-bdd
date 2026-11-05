// Service worker: guarda os arquivos do app para ele abrir mesmo sem internet.
// Estratégia "rede primeiro": com internet, sempre pega a versão mais nova;
// sem internet, usa o que ficou guardado.
const CACHE = "rolador-d20-v1"

self.addEventListener("install", (evento) => {
    evento.waitUntil(caches.open(CACHE).then((cache) => cache.add(self.registration.scope)))
    self.skipWaiting()
})

self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys()
            .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
            .then(() => self.clients.claim()),
    )
})

self.addEventListener("fetch", (evento) => {
    const pedido = evento.request
    if (pedido.method !== "GET" || new URL(pedido.url).origin !== self.location.origin) return

    evento.respondWith(
        caches.open(CACHE).then(async (cache) => {
            try {
                const resposta = await fetch(pedido)
                if (resposta.ok) cache.put(pedido, resposta.clone())
                return resposta
            } catch (erro) {
                const guardada = await cache.match(pedido, { ignoreSearch: true })
                if (guardada) return guardada
                throw erro
            }
        }),
    )
})
