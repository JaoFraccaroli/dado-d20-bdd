// BASE_PATH é usado só na versão do GitHub Pages (o site fica em /dado-d20-bdd).
// No app Android e no `npm run dev` ele fica vazio.
const basePath = process.env.BASE_PATH || ""

export default {
    output: "export",
    trailingSlash: true,
    basePath,
    images: { unoptimized: true },
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
}
