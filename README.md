# Calculadora de IMC

Projeto web com uma API REST que calcula o **IMC (Índice de Massa Corporal)** no backend.

```
IMC = Peso / Altura²
```

| IMC (kg/m²)        | Classificação |
| ------------------ | ------------- |
| menor que 18,5     | Magreza       |
| de 18,5 até 24,9   | Normal        |
| acima de 24,9 até 30 | Sobrepeso   |
| maior que 30       | Obesidade     |

## Tecnologias

- **Node.js + Express**: API REST e servidor da página.
- **HTML, CSS e JavaScript puro**: interface que consome a API (nenhum cálculo é feito no navegador).
- **node:test**: testes automatizados nativos do Node, sem dependências extras.
- **Vercel**: hospedagem (a API roda como função serverless e a pasta `public/` é servida estaticamente).

## Arquitetura

```
public/            Front-end (formulário que chama a API)
  index.html
  app.js
  style.css
src/
  imc.js           Regras de negócio: validação, cálculo e classificação (sem dependência de HTTP)
  app.js           Camada HTTP (Express): rotas, conversão da entrada e tratamento de erros
  server.js        Sobe o servidor localmente (app.listen)
test/
  imc.test.js      Testes unitários das regras de negócio, incluindo os limites das faixas
  api.test.js      Testes de integração dos endpoints
```

A regra de negócio (`src/imc.js`) é separada da camada HTTP (`src/app.js`). Assim ela pode ser testada isoladamente e
reaproveitada por outra interface (CLI, outro framework etc.).

## Como executar

Requisito: Node.js 18 ou superior.

```bash
npm install
npm start
```

Acesse http://localhost:3000.

Para rodar os testes:

```bash
npm test
```

## API

### `POST /api/imc`

Requisição:

```json
{ "peso": 70, "altura": 1.75 }
```

- `peso` em quilogramas; `altura` em **metros**.
- Aceita números ou textos, inclusive com vírgula decimal (`"1,75"`).

Resposta `200 OK`:

```json
{ "peso": 70, "altura": 1.75, "imc": 22.86, "classificacao": "Normal" }
```

Resposta `400 Bad Request` (entrada inválida):

```json
{ "erros": ["O campo \"peso\" é obrigatório e deve ser numérico (kg)."] }
```

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/api/imc \
  -H "Content-Type: application/json" \
  -d '{"peso": 70, "altura": 1.75}'
```

### `GET /api/health`

Retorna `{ "status": "ok" }`.

## Decisão sobre os limites das faixas

O enunciado repete o valor 24,9 nas faixas *Normal* e *Sobrepeso* e não diz onde cai exatamente 30. Para não deixar
"buracos" entre as faixas, a interpretação adotada foi:

- **24,9** é o último valor *Normal*; qualquer valor acima (por exemplo 24,95) já é *Sobrepeso*.
- **30** ainda é *Sobrepeso*, já que *Obesidade* é "maior que 30".

O IMC é arredondado em 2 casas decimais antes da classificação. Esses limites estão cobertos em `test/imc.test.js`.
