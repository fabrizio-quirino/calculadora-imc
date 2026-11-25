const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calcularImc, classificarImc, validarEntrada } = require('../src/imc');

test('calcularImc aplica peso / altura² com 2 casas decimais', () => {
  assert.equal(calcularImc(70, 1.75), 22.86);
  assert.equal(calcularImc(50, 1.8), 15.43);
  assert.equal(calcularImc(100, 1.7), 34.6);
});

test('classificarImc: Magreza abaixo de 18,5', () => {
  assert.equal(classificarImc(15), 'Magreza');
  assert.equal(classificarImc(18.49), 'Magreza');
});

test('classificarImc: Normal de 18,5 a 24,9', () => {
  assert.equal(classificarImc(18.5), 'Normal');
  assert.equal(classificarImc(22), 'Normal');
  assert.equal(classificarImc(24.9), 'Normal');
});

test('classificarImc: Sobrepeso acima de 24,9 até 30', () => {
  assert.equal(classificarImc(24.91), 'Sobrepeso');
  assert.equal(classificarImc(24.95), 'Sobrepeso');
  assert.equal(classificarImc(27), 'Sobrepeso');
  assert.equal(classificarImc(30), 'Sobrepeso');
});

test('classificarImc: Obesidade acima de 30', () => {
  assert.equal(classificarImc(30.01), 'Obesidade');
  assert.equal(classificarImc(40), 'Obesidade');
});

test('validarEntrada aceita valores válidos', () => {
  assert.deepEqual(validarEntrada(70, 1.75), []);
});

test('validarEntrada rejeita ausentes, não numéricos, zero e altura em cm', () => {
  assert.equal(validarEntrada(undefined, undefined).length, 2);
  assert.equal(validarEntrada(NaN, 1.75).length, 1);
  assert.equal(validarEntrada(0, 1.75).length, 1);
  assert.equal(validarEntrada(70, 175).length, 1);
});
