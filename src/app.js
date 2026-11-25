const path = require('node:path');
const express = require('express');
const { validarEntrada, calcularImc, classificarImc } = require('./imc');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * Converte o valor recebido em número. Aceita número ou string,
 * inclusive com vírgula decimal ("1,75"), comum em formulários brasileiros.
 */
function paraNumero(valor) {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string' && valor.trim() !== '') {
    return Number(valor.replace(',', '.'));
  }
  return undefined;
}

/**
 * POST /api/imc
 * Body (JSON): { "peso": 70, "altura": 1.75 }
 * 200: { "peso": 70, "altura": 1.75, "imc": 22.86, "classificacao": "Normal" }
 * 400: { "erros": ["..."] }
 */
app.post('/api/imc', (req, res) => {
  const peso = paraNumero(req.body?.peso);
  const altura = paraNumero(req.body?.altura);

  const erros = validarEntrada(peso, altura);
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const imc = calcularImc(peso, altura);
  const classificacao = classificarImc(imc);

  return res.json({ peso, altura, imc, classificacao });
});

/** GET /api/health — verificação simples de que a API está no ar. */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// JSON malformado no corpo da requisição
app.use((err, _req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erros: ['O corpo da requisição deve ser um JSON válido.'] });
  }
  return next(err);
});

module.exports = app;
