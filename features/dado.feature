# language: pt
Funcionalidade: Rolagem de um dado de 20 faces (D20)
  Como jogador de RPG
  Quero rolar um D20 na tela
  Para ver o resultado e reconhecer na hora acertos e falhas críticas

  Contexto:
    Dado que estou na página do dado

  Cenário: Antes da primeira rolagem o dado não tem resultado
    Então o dado deve mostrar "?"
    E o histórico deve estar vazio

  Cenário: Tirar 20 é um acerto crítico com o número em verde
    Dado que o próximo resultado do dado será 20
    Quando eu rolo o dado
    Então o resultado deve ser 20
    E o número deve aparecer em verde
    E deve aparecer a mensagem "Acerto crítico!"

  Cenário: Tirar 1 é uma falha crítica com o número em vermelho
    Dado que o próximo resultado do dado será 1
    Quando eu rolo o dado
    Então o resultado deve ser 1
    E o número deve aparecer em vermelho
    E deve aparecer a mensagem "Falha crítica!"

  Cenário: O dado começa no modelo Galáxia
    Então o dado escolhido deve ser o "galaxia"

  Esquema do Cenário: As regras de cor valem nos dois modelos de dado
    Dado que escolhi o dado "<modelo>"
    E que o próximo resultado do dado será <resultado>
    Quando eu rolo o dado
    Então o dado escolhido deve ser o "<id>"
    E o número deve aparecer em <cor>

    Exemplos:
      | modelo  | id      | resultado | cor      |
      | Rubi    | rubi    | 1         | vermelho |
      | Rubi    | rubi    | 20        | verde    |
      | Galáxia | galaxia | 1         | vermelho |

  Esquema do Cenário: Resultados comuns aparecem em branco, sem mensagem
    Dado que o próximo resultado do dado será <resultado>
    Quando eu rolo o dado
    Então o resultado deve ser <resultado>
    E o número deve aparecer em branco
    E não deve aparecer mensagem de crítico

    Exemplos:
      | resultado |
      | 2         |
      | 10        |
      | 19        |

  Cenário: O histórico mostra as rolagens mais recentes primeiro
    Quando eu rolo o dado tirando 7, 20 e 1
    Então o histórico deve mostrar "1, 20, 7"
    E no histórico o 20 deve estar em verde e o 1 em vermelho

  Cenário: O histórico guarda no máximo 10 rolagens
    Quando eu rolo o dado 12 vezes
    Então o histórico deve ter 10 rolagens

  Cenário: Todos os resultados ficam entre 1 e 20
    Quando eu rolo o dado 100 vezes
    Então todos os resultados devem estar entre 1 e 20
    E deve ter saído mais de um valor diferente
