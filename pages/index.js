import { useEffect, useRef, useState } from "react"
import estilos from "../styles/Dado.module.css"
import { sortearD20, tipoDoResultado } from "../lib/dado"

const TAMANHO_HISTORICO = 10


const MENSAGENS = {
    critico: "Acerto crítico!",
    falha: "Falha crítica!",
}

export default function Home() {
    const [valor, setValor] = useState(null)
    const [rolando, setRolando] = useState(false)
    const [historico, setHistorico] = useState([])
    const [totalRolagens, setTotalRolagens] = useState(0)
    const intervalo = useRef(null)

    useEffect(() => () => clearInterval(intervalo.current), [])

    function finalizar(resultado) {
        setValor(resultado)
        setRolando(false)
        setHistorico((anterior) => [resultado, ...anterior].slice(0, TAMANHO_HISTORICO))
        setTotalRolagens((total) => total + 1)
    }

    function rolar() {
        if (rolando) return
        const resultado = sortearD20()

        // Quem prefere menos movimento (configuração do sistema) vê o resultado na hora
        const semAnimacao = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (semAnimacao) {
            finalizar(resultado)
            return
        }

        setRolando(true)
        let passos = 0
        intervalo.current = setInterval(() => {
            setValor(sortearD20())
            passos++
            if (passos >= 10) {
                clearInterval(intervalo.current)
                finalizar(resultado)
            }
        }, 60)
    }

    const tipo = valor === null || rolando ? "normal" : tipoDoResultado(valor)

    return (
        <main className={estilos.pagina} data-rolagens={totalRolagens}>
            <h1 className={estilos.titulo}>Rolador de D20</h1>

            <div className={`${estilos.moldura} ${estilos[tipo]}`}>
                <div
                    className={`${estilos.dado} ${rolando ? estilos.rolando : ""}`}
                    data-testid="dado"
                    data-estado={rolando ? "rolando" : "parado"}
                    data-tipo={tipo}
                    aria-live="polite"
                >
                    <span className={estilos.numero} data-testid="resultado">
                        {valor === null ? "?" : valor}
                    </span>
                </div>
            </div>

            <p className={`${estilos.mensagem} ${estilos[tipo]}`} data-testid="mensagem">
                {!rolando && MENSAGENS[tipo] ? MENSAGENS[tipo] : " "}
            </p>

            <button className={estilos.botao} onClick={rolar} disabled={rolando}>
                {rolando ? "Rolando..." : "Rolar D20"}
            </button>

            <section className={estilos.historico}>
                <h2>Últimas rolagens</h2>
                {historico.length === 0 ? (
                    <p className={estilos.vazio}>Nenhuma rolagem ainda</p>
                ) : (
                    <ol>
                        {historico.map((r, i) => (
                            <li key={i} className={estilos[tipoDoResultado(r)]} data-testid="historico-item">
                                {r}
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </main>
    )
}
