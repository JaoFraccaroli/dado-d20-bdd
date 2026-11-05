# language: pt
Funcionalidade: Rolagem com vantagem e desvantagem
  Como jogador de RPG
  Quero rolar dois D20 de uma vez
  Para ficar com o maior (vantagem) ou com o menor (desvantagem)

  Contexto:
    Dado que estou na página do dado

  Cenário: No modo normal aparece um dado só
    Então devem aparecer 1 dados

  Cenário: Na vantagem e na desvantagem aparecem dois dados
    Dado que escolhi o modo "Vantagem"
    Então devem aparecer 2 dados

  Cenário: Na vantagem os dois resultados aparecem e fica o maior
    Dado que escolhi o modo "Vantagem"
    E que os próximos resultados dos dados serão 7 e 15
    Quando eu rolo o dado
    Então os dados devem mostrar 7 e 15
    E o resultado deve ser 15
    E o dado com 15 deve ficar em destaque
    E o dado com 7 deve ficar cinza como descartado

  Cenário: Na desvantagem os dois resultados aparecem e fica o menor
    Dado que escolhi o modo "Desvantagem"
    E que os próximos resultados dos dados serão 7 e 15
    Quando eu rolo o dado
    Então os dados devem mostrar 7 e 15
    E o resultado deve ser 7
    E o dado com 7 deve ficar em destaque
    E o dado com 15 deve ficar cinza como descartado

  Cenário: Vantagem com 1 e 20 é acerto crítico
    Dado que escolhi o modo "Vantagem"
    E que os próximos resultados dos dados serão 1 e 20
    Quando eu rolo o dado
    Então o resultado deve ser 20
    E o número deve aparecer em verde
    E deve aparecer a mensagem "Acerto crítico!"
    E o dado com 1 deve ficar cinza como descartado

  Cenário: Desvantagem com 1 e 20 é falha crítica
    Dado que escolhi o modo "Desvantagem"
    E que os próximos resultados dos dados serão 1 e 20
    Quando eu rolo o dado
    Então o resultado deve ser 1
    E o número deve aparecer em vermelho
    E deve aparecer a mensagem "Falha crítica!"
    E o dado com 20 deve ficar cinza como descartado

  Cenário: Empate nos dois dados
    Dado que escolhi o modo "Vantagem"
    E que os próximos resultados dos dados serão 12 e 12
    Quando eu rolo o dado
    Então o resultado deve ser 12
    E um dado deve ficar em destaque e o outro descartado

  Esquema do Cenário: Cada dado pode ter o seu modelo
    Dado que escolhi o modo "Vantagem"
    E que escolhi o modelo "<dado1>" para o dado 1
    E que escolhi o modelo "<dado2>" para o dado 2
    Então os modelos dos dados devem ser "<dado1>" e "<dado2>"

    Exemplos:
      | dado1   | dado2   |
      | Galáxia | Galáxia |
      | Rubi    | Rubi    |
      | Galáxia | Rubi    |
      | Rubi    | Galáxia |

  Cenário: O histórico mostra o resultado que ficou e o descartado
    Dado que escolhi o modo "Vantagem"
    E que os próximos resultados dos dados serão 7 e 15
    Quando eu rolo o dado
    Então a última rolagem no histórico deve ser 15 com o 7 descartado

  Esquema do Cenário: Em 100 rolagens o resultado é sempre o certo
    Dado que escolhi o modo "<modo>"
    Quando eu rolo o dado 100 vezes
    Então o resultado de cada rolagem deve ser o <qual> dos dois dados
    E todos os resultados devem estar entre 1 e 20

    Exemplos:
      | modo        | qual  |
      | Vantagem    | maior |
      | Desvantagem | menor |
