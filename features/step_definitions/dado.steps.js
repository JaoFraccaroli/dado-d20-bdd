import { Given, Then, When } from "@cucumber/cucumber"
import { expect } from "@playwright/test"
import { PaginaDado } from "../support/pagina-dado.js"

const CORES = {
    verde: "rgb(34, 197, 94)",
    vermelho: "rgb(239, 68, 68)",
    branco: "rgb(255, 255, 255)",
}

const IDS_MODELO = { "Galáxia": "galaxia", "Rubi": "rubi" }

// ---------- Preparação ----------

Given("que estou na página do dado", async function () {
    this.pagina = new PaginaDado(this.page, this.baseUrl)
    await this.pagina.abrir()
})

Given("que escolhi o dado {string}", async function (modelo) {
    await this.pagina.escolherModelo(modelo, 1)
})

Given("que escolhi o modo {string}", async function (modo) {
    await this.pagina.escolherModo(modo)
})

Given("que escolhi o modelo {string} para o dado {int}", async function (modelo, numero) {
    await this.pagina.escolherModelo(modelo, numero)
})

Given("que o próximo resultado do dado será {int}", async function (valor) {
    await this.pagina.definirProximoResultado(valor)
})

Given("que os próximos resultados dos dados serão {int} e {int}", async function (a, b) {
    await this.pagina.definirProximosResultados([a, b])
})

// ---------- Ações ----------

When("eu rolo o dado", async function () {
    this.ultimaRolagem = await this.pagina.rolar()
})

When("eu rolo o dado tirando {int}, {int} e {int}", async function (a, b, c) {
    for (const valor of [a, b, c]) {
        await this.pagina.definirProximoResultado(valor)
        await this.pagina.rolar()
    }
})

When("eu rolo o dado {int} vezes", async function (vezes) {
    this.rolagens = []
    for (let i = 0; i < vezes; i++) {
        this.rolagens.push(await this.pagina.rolar())
    }
    this.resultados = this.rolagens.map((r) => r.fica)
})

// ---------- Verificações: um dado ----------

Then("o dado deve mostrar {string}", async function (texto) {
    await expect(this.pagina.resultado()).toHaveText(texto)
})

Then("o histórico deve estar vazio", async function () {
    await expect(this.pagina.itensDoHistorico()).toHaveCount(0)
})

Then("o resultado deve ser {int}", async function (valor) {
    await expect(this.pagina.resultado()).toHaveText(String(valor))
})

Then("o número deve aparecer em verde", async function () {
    expect(await this.pagina.corDoNumero()).toBe(CORES.verde)
})

Then("o número deve aparecer em vermelho", async function () {
    expect(await this.pagina.corDoNumero()).toBe(CORES.vermelho)
})

Then("o número deve aparecer em branco", async function () {
    expect(await this.pagina.corDoNumero()).toBe(CORES.branco)
})

Then("deve aparecer a mensagem {string}", async function (mensagem) {
    await expect(this.pagina.mensagem()).toHaveText(mensagem)
})

Then("não deve aparecer mensagem de crítico", async function () {
    const texto = await this.pagina.mensagem().textContent()
    expect(texto).not.toMatch(/crític/i)
})

Then("o dado escolhido deve ser o {string}", async function (modelo) {
    expect((await this.pagina.modelos())[0]).toBe(modelo)
})

// ---------- Verificações: dois dados ----------

Then("devem aparecer {int} dados", async function (quantidade) {
    await expect(this.pagina.dados()).toHaveCount(quantidade)
})

Then("os dados devem mostrar {int} e {int}", function (a, b) {
    expect(this.ultimaRolagem.valores.join(",")).toBe(`${a},${b}`)
})

Then("o dado com {int} deve ficar em destaque", async function (valor) {
    const { situacao, escala } = await this.pagina.estiloDoDado(valor)
    expect(situacao).toBe("fica")
    expect(escala).toBeGreaterThan(1)
})

Then("o dado com {int} deve ficar cinza como descartado", async function (valor) {
    const { situacao, filtro } = await this.pagina.estiloDoDado(valor)
    expect(situacao).toBe("descartado")
    expect(filtro).toMatch(/grayscale\(1\)/)
})

Then("um dado deve ficar em destaque e o outro descartado", async function () {
    const situacoes = await this.pagina.dados().evaluateAll((els) => els.map((el) => el.dataset.situacao).sort())
    expect(situacoes.join(",")).toBe("descartado,fica")
})

Then("os modelos dos dados devem ser {string} e {string}", async function (a, b) {
    expect((await this.pagina.modelos()).join(",")).toBe(`${IDS_MODELO[a]},${IDS_MODELO[b]}`)
})

// ---------- Verificações: histórico e sorteio ----------

Then("o histórico deve mostrar {string}", async function (esperado) {
    expect((await this.pagina.textosDoHistorico()).join(", ")).toBe(esperado)
})

Then("no histórico o 20 deve estar em verde e o 1 em vermelho", async function () {
    const cores = await this.page.getByTestId("historico-valor").evaluateAll((itens) =>
        Object.fromEntries(itens.map((el) => [el.textContent.trim(), getComputedStyle(el).color])))
    expect(cores["20"]).toBe(CORES.verde)
    expect(cores["1"]).toBe(CORES.vermelho)
})

Then("a última rolagem no histórico deve ser {int} com o {int} descartado", async function (valor, descartado) {
    const ultima = await this.pagina.ultimaRolagemNoHistorico()
    expect(`${ultima.valor}/${ultima.descartado}`).toBe(`${valor}/${descartado}`)
})

Then("o histórico deve ter {int} rolagens", async function (quantidade) {
    await expect(this.pagina.itensDoHistorico()).toHaveCount(quantidade)
})

Then("todos os resultados devem estar entre 1 e 20", function () {
    for (const r of this.resultados) {
        expect(Number.isInteger(r)).toBe(true)
        expect(r).toBeGreaterThanOrEqual(1)
        expect(r).toBeLessThanOrEqual(20)
    }
})

Then("deve ter saído mais de um valor diferente", function () {
    expect(new Set(this.resultados).size).toBeGreaterThan(1)
})

Then("o resultado de cada rolagem deve ser o {word} dos dois dados", function (qual) {
    for (const { valores, fica } of this.rolagens) {
        const esperado = qual === "maior" ? Math.max(...valores) : Math.min(...valores)
        expect(fica).toBe(esperado)
    }
})
