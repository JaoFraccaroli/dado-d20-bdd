export function sortearD20() {
    return Math.floor(Math.random() * 20) + 1
}

export function tipoDoResultado(valor) {
    if (valor === 20) return "critico"
    if (valor === 1) return "falha"
    return "normal"
}
