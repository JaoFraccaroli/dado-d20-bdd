import { Given, Then, When } from "@cucumber/cucumber"
import { expect } from "@playwright/test"
import { PaginaDado } from "../support/pagina-dado.js"

const CORES = {
    verde: "rgb(34, 197, 94)",
    vermelho: "rgb(239, 68, 68)",
    normal: "rgb(255, 255, 255)",
}

Given("que estou na página do dado", async function () {
    this.pagina = new PaginaDado(this.page, this.baseUrl)
    await this.pagina.abrir()
})

Given("que escolhi o dado {string}", async function (modelo) {
    await this.pagina.escolherModelo(modelo)
})

Given("que o próximo resultado do dado será {int}", async function (valor) {
    await this.pagina.definirProximoResultado(valor)
})

When("eu rolo o dado", async function () {
    this.ultimoResultado = await this.pagina.rolar()
})

When("eu rolo o dado tirando {int}, {int} e {int}", async function (a, b, c) {
    for (const valor of [a, b, c]) {
        await this.pagina.definirProximoResultado(valor)
        await this.pagina.rolar()
    }
})

When("eu rolo o dado {int} vezes", async function (vezes) {
    this.resultados = []
    for (let i = 0; i < vezes; i++) {
        this.resultados.push(await this.pagina.rolar())
    }
})

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
    expect(await this.pagina.corDoNumero()).toBe(CORES.normal)
})

Then("deve aparecer a mensagem {string}", async function (mensagem) {
    await expect(this.pagina.mensagem()).toHaveText(mensagem)
})

Then("não deve aparecer mensagem de crítico", async function () {
    const texto = await this.pagina.mensagem().textContent()
    expect(texto).not.toMatch(/crític/i)
})

Then("o histórico deve mostrar {string}", async function (esperado) {
    expect((await this.pagina.textosDoHistorico()).join(", ")).toBe(esperado)
})

Then("no histórico o 20 deve estar em verde e o 1 em vermelho", async function () {
    const cores = await this.pagina.itensDoHistorico().evaluateAll((itens) =>
        Object.fromEntries(itens.map((el) => [el.textContent.trim(), getComputedStyle(el).color])))
    expect(cores["20"]).toBe(CORES.verde)
    expect(cores["1"]).toBe(CORES.vermelho)
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

Then("o dado escolhido deve ser o {string}", async function (modelo) {
    expect(await this.pagina.modeloAtual()).toBe(modelo)
})
