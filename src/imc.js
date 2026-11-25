/**
 * Regras de negócio do IMC (Índice de Massa Corporal).
 *
 * Este módulo não conhece HTTP nem Express: recebe números e devolve números/texto.
 * Isso permite testá-lo isoladamente e reaproveitá-lo em outra interface.
 */

const ALTURA_MAXIMA_METROS = 3;
const PESO_MAXIMO_KG = 700;

/**
 * Valida peso e altura. Retorna uma lista de mensagens de erro (vazia se tudo ok).
 * @param {unknown} peso   em quilogramas
 * @param {unknown} altura em metros
 * @returns {string[]}
 */
function validarEntrada(peso, altura) {
  const erros = [];

  if (typeof peso !== 'number' || !Number.isFinite(peso)) {
    erros.push('O campo "peso" é obrigatório e deve ser numérico (kg).');
  } else if (peso <= 0 || peso > PESO_MAXIMO_KG) {
    erros.push(`O peso deve ser maior que 0 e no máximo ${PESO_MAXIMO_KG} kg.`);
  }

  if (typeof altura !== 'number' || !Number.isFinite(altura)) {
    erros.push('O campo "altura" é obrigatório e deve ser numérico (m).');
  } else if (altura <= 0 || altura > ALTURA_MAXIMA_METROS) {
    erros.push(
      `A altura deve ser informada em metros (ex.: 1.75), entre 0 e ${ALTURA_MAXIMA_METROS} m.`
    );
  }

  return erros;
}

/**
 * IMC = peso / altura²
 * @param {number} peso   em kg
 * @param {number} altura em m
 * @returns {number} IMC arredondado em 2 casas decimais
 */
function calcularImc(peso, altura) {
  const imc = peso / (altura * altura);
  return Math.round(imc * 100) / 100;
}

/**
 * Classifica o IMC conforme a tabela do enunciado:
 *   Magreza    : menor que 18,5
 *   Normal     : entre 18,5 e 24,9
 *   Sobrepeso  : entre 24,9 e 30
 *   Obesidade  : maior que 30
 *
 * @param {number} imc
 * @returns {'Magreza' | 'Normal' | 'Sobrepeso' | 'Obesidade'}
 */
function classificarImc(imc) {
  // O enunciado repete 24,9 nas faixas Normal e Sobrepeso e não diz onde cai exatamente 30.
  // Interpretação adotada (sem "buracos" entre as faixas):
  //   - 24,9 é o último valor Normal; qualquer valor acima (ex.: 24,95) já é Sobrepeso.
  //   - 30 ainda é Sobrepeso, pois Obesidade é "maior que 30".
  if (imc < 18.5) return 'Magreza';
  if (imc <= 24.9) return 'Normal';
  if (imc <= 30) return 'Sobrepeso';
  return 'Obesidade';
}

module.exports = { validarEntrada, calcularImc, classificarImc };
