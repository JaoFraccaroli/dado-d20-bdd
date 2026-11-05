import { useEffect, useRef, useState } from "react"
import estilos from "../styles/Dado.module.css"
import DadoD20 from "../components/DadoD20"
import { indiceQueFica, sortearD20, tipoDoResultado } from "../lib/dado"

const TAMANHO_HISTORICO = 10

const MODOS = [
    { id: "normal", nome: "Normal", sigla: "" },
    { id: "vantagem", nome: "Vantagem", sigla: "V" },
    { id: "desvantagem", nome: "Desvantagem", sigla: "D" },
]

const MODELOS = [
    { id: "galaxia", nome: "Galáxia" },
    { id: "rubi", nome: "Rubi" },
]

const MENSAGENS = {
    critico: "Acerto crítico!",
    falha: "Falha crítica!",
}

export default function Home() {
    const [modo, setModo] = useState("normal")
    const [modelos, setModelos] = useState(["galaxia", "rubi"])
    const [valores, setValores] = useState(null)
    const [indiceFica, setIndiceFica] = useState(null)
    const [rolando, setRolando] = useState(false)
    const [historico, setHistorico] = useState([])
    const [totalRolagens, setTotalRolagens] = useState(0)
    const intervalo = useRef(null)

    useEffect(() => () => clearInterval(intervalo.current), [])

    const quantidade = modo === "normal" ? 1 : 2

    function trocarModo(novo) {
        if (novo === modo) return
        setModo(novo)
        setValores(null)
        setIndiceFica(null)
    }

    function trocarModelo(indice, modelo) {
        setModelos((atuais) => atuais.map((m, i) => (i === indice ? modelo : m)))
    }

    function sortear() {
        return Array.from({ length: quantidade }, () => sortearD20())
    }

    function finalizar(finais) {
        const fica = indiceQueFica(finais, modo)
        setValores(finais)
        setIndiceFica(fica)
        setRolando(false)
        const registro = {
            valor: finais[fica],
            descartado: finais.length === 2 ? finais[1 - fica] : null,
            sigla: MODOS.find((m) => m.id === modo).sigla,
        }
        setHistorico((anterior) => [registro, ...anterior].slice(0, TAMANHO_HISTORICO))
        setTotalRolagens((total) => total + 1)
    }

    function rolar() {
        if (rolando) return
        const finais = sortear()

        // Quem prefere menos movimento (configuração do sistema) vê o resultado na hora
        const semAnimacao = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (semAnimacao) {
            finalizar(finais)
            return
        }

        setRolando(true)
        setIndiceFica(null)
        let passos = 0
        intervalo.current = setInterval(() => {
            setValores(sortear())
            passos++
            if (passos >= 12) {
                clearInterval(intervalo.current)
                finalizar(finais)
            }
        }, 60)
    }

    function situacaoDo(indice) {
        if (rolando) return "rolando"
        if (quantidade === 1) return "fica"
        if (valores === null) return "aguardando"
        return indice === indiceFica ? "fica" : "descartado"
    }

    const resultadoFinal = !rolando && valores !== null ? valores[indiceFica ?? 0] : null
    const tipoFinal = resultadoFinal === null ? "normal" : tipoDoResultado(resultadoFinal)

    return (
        <main className={estilos.pagina} data-rolagens={totalRolagens} data-estado={rolando ? "rolando" : "parado"}>
            <h1 className={estilos.titulo}>Rolador de D20</h1>

            <div className={estilos.grupo} role="group" aria-label="Modo de rolagem">
                {MODOS.map((m) => (
                    <button key={m.id} className={estilos.botaoModo} aria-pressed={modo === m.id}
                            onClick={() => trocarModo(m.id)} disabled={rolando}>
                        {m.nome}
                    </button>
                ))}
            </div>

            <div className={estilos.seletores}>
                {Array.from({ length: quantidade }, (_, indice) => (
                    <div key={indice} className={estilos.grupo} role="group" aria-label={`Modelo do dado ${indice + 1}`}>
                        <span className={estilos.rotulo}>{quantidade === 1 ? "Dado" : `Dado ${indice + 1}`}</span>
                        {MODELOS.map((m) => (
                            <button key={m.id}
                                    className={`${estilos.botaoModelo} ${estilos["amostra_" + m.id]}`}
                                    aria-pressed={modelos[indice] === m.id}
                                    onClick={() => trocarModelo(indice, m.id)} disabled={rolando}>
                                {m.nome}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            <div className={`${estilos.mesa} ${quantidade === 2 ? estilos.doisDados : ""}`}>
                {Array.from({ length: quantidade }, (_, indice) => {
                    const valor = valores ? valores[indice] : null
                    const situacao = situacaoDo(indice)
                    const tipo = situacao === "fica" && valor !== null ? tipoDoResultado(valor) : "normal"
                    return (
                        <div key={indice}
                             className={`${estilos.slot} ${situacao === "descartado" ? estilos.descartado : ""} ${quantidade === 2 && situacao === "fica" ? estilos.destaque : ""}`}
                             data-testid="dado" data-situacao={situacao} data-modelo={modelos[indice]} data-tipo={tipo}>
                            <div className={`${estilos.dado} ${estilos[modelos[indice]]} ${estilos[tipo] || ""} ${rolando ? estilos.rolando : ""}`}
                                 aria-live="polite">
                                <DadoD20 valor={valor} estilos={estilos} />
                            </div>
                            <div className={`${estilos.sombra} ${rolando ? estilos.sombraRolando : ""}`} />
                            {quantidade === 2 && (situacao === "fica" || situacao === "descartado") && (
                                <span className={estilos.selo}>{situacao === "fica" ? "Fica" : "Descartado"}</span>
                            )}
                        </div>
                    )
                })}
            </div>

            <p className={`${estilos.mensagem} ${estilos[tipoFinal] || ""}`} data-testid="mensagem">
                {MENSAGENS[tipoFinal] ?? " "}
            </p>

            <button className={estilos.botao} onClick={rolar} disabled={rolando} data-testid="botao-rolar">
                {rolando ? "Rolando..." : quantidade === 1 ? "Rolar D20" : "Rolar 2 D20"}
            </button>

            <section className={estilos.historico}>
                <h2>Últimas rolagens</h2>
                {historico.length === 0 ? (
                    <p className={estilos.vazio}>Nenhuma rolagem ainda</p>
                ) : (
                    <ol>
                        {historico.map((r, i) => (
                            <li key={i} className={estilos[tipoDoResultado(r.valor)] || ""} data-testid="historico-item">
                                <span data-testid="historico-valor">{r.valor}</span>
                                {r.descartado !== null && (
                                    <s className={estilos.descartadoHistorico} data-testid="historico-descartado">{r.descartado}</s>
                                )}
                                {r.sigla && <span className={estilos.sigla} title={r.sigla === "V" ? "Vantagem" : "Desvantagem"}>{r.sigla}</span>}
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </main>
    )
}
