import { useEffect, useRef, useState } from "react"
import estilos from "../styles/Dado.module.css"
import DadoD20 from "../components/DadoD20"
import { sortearD20, tipoDoResultado } from "../lib/dado"

const TAMANHO_HISTORICO = 10

const MODELOS = [
    { id: "galaxia", nome: "Galáxia" },
    { id: "rubi", nome: "Rubi" },
]

const MENSAGENS = {
    critico: "Acerto crítico!",
    falha: "Falha crítica!",
}

export default function Home() {
    const [valor, setValor] = useState(null)
    const [rolando, setRolando] = useState(false)
    const [historico, setHistorico] = useState([])
    const [totalRolagens, setTotalRolagens] = useState(0)
    const [modelo, setModelo] = useState("galaxia")
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
            if (passos >= 12) {
                clearInterval(intervalo.current)
                finalizar(resultado)
            }
        }, 60)
    }

    const tipo = valor === null || rolando ? "normal" : tipoDoResultado(valor)

    return (
        <main className={estilos.pagina} data-rolagens={totalRolagens}>
            <h1 className={estilos.titulo}>Rolador de D20</h1>

            <div className={estilos.modelos} role="group" aria-label="Escolha o dado">
                {MODELOS.map((m) => (
                    <button
                        key={m.id}
                        className={`${estilos.botaoModelo} ${estilos["amostra_" + m.id]}`}
                        aria-pressed={modelo === m.id}
                        onClick={() => setModelo(m.id)}
                        disabled={rolando}
                    >
                        {m.nome}
                    </button>
                ))}
            </div>

            <div className={estilos.mesa}>
                <div
                    className={`${estilos.dado} ${estilos[modelo]} ${estilos[tipo] || ""} ${rolando ? estilos.rolando : ""}`}
                    data-testid="dado"
                    data-modelo={modelo}
                    data-estado={rolando ? "rolando" : "parado"}
                    data-tipo={tipo}
                    aria-live="polite"
                >
                    <DadoD20 valor={valor} estilos={estilos} />
                </div>
                <div className={`${estilos.sombra} ${rolando ? estilos.sombraRolando : ""}`} />
            </div>

            <p className={`${estilos.mensagem} ${estilos[tipo] || ""}`} data-testid="mensagem">
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
                            <li key={i} className={estilos[tipoDoResultado(r)] || ""} data-testid="historico-item">
                                {r}
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </main>
    )
}
