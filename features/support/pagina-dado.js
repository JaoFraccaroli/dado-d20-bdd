// Page Object: concentra os seletores e ações da página do dado
export class PaginaDado {
    constructor(page, baseUrl) {
        this.page = page
        this.baseUrl = baseUrl
    }

    async abrir() {
        await this.page.goto(this.baseUrl)
        await this.dados().first().waitFor()
    }

    dados() {
        return this.page.getByTestId("dado")
    }

    dadoComValor(valor) {
        return this.dados().filter({ has: this.page.locator(`[data-testid="resultado"]`, { hasText: new RegExp(`^${valor}$`) }) })
    }

    // Número do dado que vale (no modo normal é o único dado)
    resultado() {
        return this.page.locator('[data-testid="dado"][data-situacao="fica"] [data-testid="resultado"]')
    }

    mensagem() {
        return this.page.getByTestId("mensagem")
    }

    itensDoHistorico() {
        return this.page.getByTestId("historico-item")
    }

    async escolherModo(nome) {
        await this.page.getByRole("group", { name: "Modo de rolagem" }).getByRole("button", { name: nome, exact: true }).click()
    }

    async escolherModelo(nome, numeroDoDado = 1) {
        await this.page.getByRole("group", { name: `Modelo do dado ${numeroDoDado}` })
            .getByRole("button", { name: nome, exact: true }).click()
    }

    async modelos() {
        return this.dados().evaluateAll((els) => els.map((el) => el.dataset.modelo))
    }

    // Controla o sorteio: troca o Math.random da página para sair, em ordem, os valores desejados
    async definirProximosResultados(valores) {
        await this.page.evaluate((fila) => {
            const restantes = [...fila]
            const ultimo = fila[fila.length - 1]
            Math.random = () => {
                const v = restantes.length ? restantes.shift() : ultimo
                return (v - 1) / 20 + 0.01
            }
        }, valores)
    }

    async definirProximoResultado(valor) {
        await this.definirProximosResultados([valor])
    }

    // Clica em rolar e espera a rolagem terminar
    async rolar() {
        const antes = Number(await this.page.locator("main").getAttribute("data-rolagens"))
        await this.page.getByTestId("botao-rolar").click()
        await this.page.locator(`main[data-rolagens="${antes + 1}"][data-estado="parado"]`).waitFor()
        const valores = (await this.page.getByTestId("resultado").allTextContents()).map(Number)
        const fica = Number(await this.resultado().textContent())
        return { valores, fica }
    }

    async corDoNumero() {
        return this.resultado().evaluate((el) => getComputedStyle(el).color)
    }

    async estiloDoDado(valor) {
        return this.dadoComValor(valor).first().evaluate((el) => {
            const estilo = getComputedStyle(el)
            const matriz = estilo.transform === "none" ? 1 : Number(estilo.transform.match(/matrix\(([^,]+)/)[1])
            return { situacao: el.dataset.situacao, filtro: estilo.filter, escala: matriz }
        })
    }

    async textosDoHistorico() {
        return (await this.page.getByTestId("historico-valor").allTextContents()).map((t) => t.trim())
    }

    async ultimaRolagemNoHistorico() {
        const item = this.itensDoHistorico().first()
        return {
            valor: (await item.getByTestId("historico-valor").textContent()).trim(),
            descartado: (await item.getByTestId("historico-descartado").textContent()).trim(),
        }
    }
}
