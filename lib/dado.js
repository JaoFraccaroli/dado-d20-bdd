export function sortearD20() {
    return Math.floor(Math.random() * 20) + 1
}

export function tipoDoResultado(valor) {
    if (valor === 20) return "critico"
    if (valor === 1) return "falha"
    return "normal"
}

// Com dois dados: vantagem fica com o maior, desvantagem com o menor.
// Em caso de empate fica o primeiro. Devolve o índice do dado que fica.
export function indiceQueFica(valores, modo) {
    if (valores.length < 2) return 0
    const [a, b] = valores
    if (modo === "vantagem") return a >= b ? 0 : 1
    if (modo === "desvantagem") return a <= b ? 0 : 1
    return 0
}
