const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

function postImc(body) {
  return fetch(`${baseUrl}/api/imc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test('POST /api/imc retorna IMC e classificação', async () => {
  const res = await postImc({ peso: 70, altura: 1.75 });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    peso: 70,
    altura: 1.75,
    imc: 22.86,
    classificacao: 'Normal',
  });
});

test('POST /api/imc aceita strings com vírgula decimal', async () => {
  const res = await postImc({ peso: '95,5', altura: '1,70' });
  assert.equal(res.status, 200);
  const dados = await res.json();
  assert.equal(dados.imc, 33.04);
  assert.equal(dados.classificacao, 'Obesidade');
});

test('POST /api/imc devolve 400 com lista de erros para entrada inválida', async () => {
  const res = await postImc({ peso: 'abc' });
  assert.equal(res.status, 400);
  const dados = await res.json();
  assert.equal(dados.erros.length, 2);
});

test('POST /api/imc devolve 400 para JSON malformado', async () => {
  const res = await postImc('{peso: 70');
  assert.equal(res.status, 400);
});

test('GET /api/health responde ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.deepEqual(await res.json(), { status: 'ok' });
});
