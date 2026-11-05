// Desenho de um D20 visto de cima: a face sorteada no centro e as faces vizinhas em volta,
// como num dado de verdade parado na mesa.

const HEXAGONO = [[0, -100], [86.6, -50], [86.6, 50], [0, 100], [-86.6, 50], [-86.6, -50]]
const TOPO = [[0, -62], [53.7, 31], [-53.7, 31]]

const [H0, H1, H2, H3, H4, H5] = HEXAGONO
const [T0, T1, T2] = TOPO

// Faces vizinhas (encostadas na face de cima) e as faces das bordas
const VIZINHAS = [[T0, T1, H1], [T1, T2, H3], [T2, T0, H5]]
const BORDAS = [[T0, H0, H1], [T1, H1, H2], [T1, H2, H3], [T2, H3, H4], [T2, H4, H5], [T0, H5, H0]]

const pontos = (face) => face.map(([x, y]) => `${x},${y}`).join(" ")

// Posição e giro dos números das faces vizinhas (o de baixo fica de cabeça para baixo)
const NUMEROS_VIZINHOS = [
    { x: 45.5, y: -26.3, giro: 60 },
    { x: 0, y: 52.7, giro: 180 },
    { x: -45.5, y: -26.3, giro: -60 },
]

// Estrelas do modelo Galáxia (posições fixas)
const ESTRELAS = [[-33.5, -66.3, 0.5], [-81.2, 6.8, 0.7], [15.7, 77.8, 0.6], [-87.9, -12.6, 0.5], [-49.3, 9.7, 0.5], [62.1, -71.5, 0.6], [24.8, 15.8, 0.5], [14.6, -19.6, 0.6], [-86.1, 68.1, 0.7], [-15.4, 7.7, 1.2], [-36.4, 60.1, 0.6], [-75.4, 13.5, 0.6], [-24.2, 9.1, 0.5], [12.2, 22.6, 0.9], [34.3, -13.8, 0.7], [-6.5, 80.5, 0.7], [-38.0, 55.9, 0.6], [-79.4, -38.0, 0.9], [71.3, 43.6, 0.7], [20.7, -81.1, 1.2], [-15.6, 48.9, 0.6], [82.3, -14.9, 0.5], [50.3, 13.9, 0.7], [-30.4, -28.5, 0.9], [15.2, -8.3, 0.5], [84.5, -4.9, 0.5], [-83.5, 38.3, 1.2], [93.7, 61.2, 0.7], [41.2, 73.5, 0.7], [-90.7, -7.3, 0.6], [21.1, -1.2, 0.6], [51.0, -70.4, 0.6], [-19.4, 79.2, 0.9], [-79.7, -9.7, 1.2], [-42.2, -69.0, 0.9], [69.2, -42.1, 0.9], [92.4, 34.7, 0.9], [87.0, -66.3, 0.6], [-66.3, 30.1, 0.5], [-2.9, 16.9, 0.7], [-41.4, -67.3, 1.2], [-24.8, 12.6, 0.6], [36.2, 2.9, 1.2], [29.4, 45.6, 0.9], [75.9, 53.2, 1.2], [-20.4, -19.2, 0.5], [-3.5, -18.9, 0.6], [-82.2, -55.3, 0.6], [-74.1, 19.1, 0.5], [-95.0, -66.3, 0.5], [85.3, 21.6, 0.5], [71.1, 21.7, 0.6], [25.5, 86.5, 1.2], [-25.8, -71.7, 0.9], [93.7, -6.5, 0.9], [-35.7, -67.6, 0.7], [45.7, -4.1, 0.6], [3.1, -56.0, 1.2], [-26.3, 36.1, 0.5], [49.0, -38.4, 0.5], [37.3, -45.4, 0.7], [77.6, -27.4, 0.6], [6.2, 53.0, 0.7], [25.9, 21.5, 0.6], [58.2, 60.5, 0.6], [-57.0, -1.4, 0.5], [93.0, 55.1, 0.9], [-45.8, 36.6, 0.7], [-10.0, 83.0, 0.7], [86.5, -25.7, 0.6]]

// Números das faces vizinhas: só decoração, sempre diferentes do resultado
function vizinhosDe(valor) {
    if (valor === null) return [8, 14, 2]
    return [3, 7, 11].map((salto) => ((valor + salto - 1) % 20) + 1)
}

export default function DadoD20({ valor, estilos }) {
    const sublinhado = valor === 6 || valor === 9

    return (
        <svg viewBox="-110 -110 220 220" className={estilos.svg} role="img">
            <defs>
                <clipPath id="recorte-dado">
                    <polygon points={pontos(HEXAGONO)} />
                </clipPath>

                {/* Galáxia: núcleo claro e dourado, braços verde-azulados, espaço escuro */}
                <radialGradient id="galaxia-fundo" cx="38%" cy="36%" r="75%">
                    <stop offset="0%" stopColor="#fffdf2" />
                    <stop offset="12%" stopColor="#fbeab4" />
                    <stop offset="28%" stopColor="#e2b867" />
                    <stop offset="45%" stopColor="#4f8f86" />
                    <stop offset="65%" stopColor="#1c4652" />
                    <stop offset="85%" stopColor="#0c1e33" />
                    <stop offset="100%" stopColor="#060b1c" />
                </radialGradient>
                <filter id="desfoque">
                    <feGaussianBlur stdDeviation="5" />
                </filter>

                {/* Rubi: vermelho profundo com reflexos */}
                <radialGradient id="rubi-fundo" cx="50%" cy="45%" r="70%">
                    <stop offset="0%" stopColor="#ff2a3d" />
                    <stop offset="35%" stopColor="#c4001a" />
                    <stop offset="75%" stopColor="#7d0010" />
                    <stop offset="100%" stopColor="#3d0006" />
                </radialGradient>
            </defs>

            <g clipPath="url(#recorte-dado)">
                <polygon points={pontos(HEXAGONO)} className={estilos.fundo} />

                {/* Braços da galáxia e estrelas */}
                <g className={estilos.camadaGalaxia}>
                    <path d="M -95 10 C -60 -70, 30 -80, 60 -20 C 75 15, 40 45, 5 30" className={estilos.bracoClaro} filter="url(#desfoque)" />
                    <path d="M 95 -20 C 70 60, -20 85, -55 35 C -70 10, -45 -25, -10 -15" className={estilos.bracoEscuro} filter="url(#desfoque)" />
                    {ESTRELAS.map(([x, y, r], i) => (
                        <circle key={i} cx={x} cy={y} r={r} className={estilos.estrela} />
                    ))}
                </g>

                {/* Reflexos brancos de pedra lapidada */}
                <g className={estilos.camadaRubi}>
                    <polygon points="-86.6,-50 -55,-12 -86.6,10" className={estilos.reflexoForte} />
                    <polygon points="86.6,-10 60,20 86.6,45" className={estilos.reflexoForte} />
                    <polygon points="-20,-40 15,-48 0,-15" className={estilos.reflexoFraco} />
                    <polygon points="10,60 40,48 28,78" className={estilos.reflexoFraco} />
                </g>
            </g>

            {/* Facetas: cada face com um tom, por cima do fundo */}
            {BORDAS.map((face, i) => (
                <polygon key={`b${i}`} points={pontos(face)} className={estilos.faceBorda} />
            ))}
            {VIZINHAS.map((face, i) => (
                <polygon key={`v${i}`} points={pontos(face)} className={estilos.faceVizinha} />
            ))}
            <polygon points={pontos(TOPO)} className={estilos.faceTopo} />

            {vizinhosDe(valor).map((n, i) => {
                const { x, y, giro } = NUMEROS_VIZINHOS[i]
                return (
                    <text key={`n${i}`} x={x} y={y} transform={`rotate(${giro} ${x} ${y})`}
                          className={estilos.numeroVizinho} textAnchor="middle" dominantBaseline="central">
                        {n}
                    </text>
                )
            })}

            <text x="0" y="8" textAnchor="middle" dominantBaseline="central"
                  className={estilos.numero} textDecoration={sublinhado ? "underline" : undefined}
                  data-testid="resultado">
                {valor === null ? "?" : valor}
            </text>
        </svg>
    )
}
