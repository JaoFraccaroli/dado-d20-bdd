// Page Object: concentra os seletores e ações da página do dado
export class PaginaDado {
    constructor(page, baseUrl) {
        this.page = page
        this.baseUrl = baseUrl
    }

    async abrir() {
        await this.page.goto(this.baseUrl)
        await this.resultado().waitFor()
    }

    dado() {
        return this.page.getByTestId("dado")
    }

    resultado() {
        return this.page.getByTestId("resultado")
    }

    mensagem() {
        return this.page.getByTestId("mensagem")
    }

    itensDoHistorico() {
        return this.page.getByTestId("historico-item")
    }

    // Controla o sorteio: troca o Math.random da página para sair o valor desejado
    async definirProximoResultado(valor) {
        await this.page.evaluate((v) => {
            Math.random = () => (v - 1) / 20 + 0.01
        }, valor)
    }

    // Clica em "Rolar D20" e espera a rolagem terminar
    async rolar() {
        const pagina = this.page.locator("main")
        const antes = Number(await pagina.getAttribute("data-rolagens"))
        await this.page.getByRole("button", { name: "Rolar D20" }).click()
        await this.page.locator(`main[data-rolagens="${antes + 1}"]`).waitFor()
        await this.page.locator('[data-testid="dado"][data-estado="parado"]').waitFor()
        return Number(await this.resultado().textContent())
    }

    async corDoNumero() {
        return this.resultado().evaluate((el) => getComputedStyle(el).color)
    }

    async textosDoHistorico() {
        return (await this.itensDoHistorico().allTextContents()).map((t) => t.trim())
    }
}
