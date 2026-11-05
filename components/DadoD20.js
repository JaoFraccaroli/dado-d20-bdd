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

// Números das faces vizinhas: só decoração, sempre diferentes do resultado
function vizinhosDe(valor) {
    if (valor === null) return [8, 14, 2]
    return [3, 7, 11].map((salto) => ((valor + salto - 1) % 20) + 1)
}

export default function DadoD20({ valor, estilos }) {
    const sublinhado = valor === 6 || valor === 9

    return (
        <svg viewBox="-110 -110 220 220" className={estilos.svg} aria-hidden="false" role="img">
            <defs>
                <pattern id="brilho" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="4" r="0.9" className={estilos.purpurina} />
                    <circle cx="11" cy="2" r="0.6" className={estilos.purpurina} />
                    <circle cx="8" cy="10" r="0.8" className={estilos.purpurina} />
                    <circle cx="14" cy="13" r="0.5" className={estilos.purpurina} />
                    <circle cx="2" cy="14" r="0.6" className={estilos.purpurina} />
                </pattern>
                <radialGradient id="reflexo" cx="35%" cy="25%" r="75%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                    <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
                </radialGradient>
            </defs>

            {BORDAS.map((face, i) => (
                <polygon key={`b${i}`} points={pontos(face)} className={estilos.faceBorda} />
            ))}
            {VIZINHAS.map((face, i) => (
                <polygon key={`v${i}`} points={pontos(face)} className={estilos.faceVizinha} />
            ))}
            <polygon points={pontos(TOPO)} className={estilos.faceTopo} />

            {/* purpurina (aparece no modelo Galáxia) e reflexo de luz */}
            <polygon points={pontos(HEXAGONO)} fill="url(#brilho)" className={estilos.camadaBrilho} />
            <polygon points={pontos(HEXAGONO)} fill="url(#reflexo)" />

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
