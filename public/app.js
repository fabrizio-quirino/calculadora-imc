// Front-end: apenas coleta os dados e chama a API. Nenhum cálculo é feito aqui.
const form = document.getElementById('form-imc');
const resultado = document.getElementById('resultado');

function mostrar(html, tipo) {
  resultado.className = `resultado ${tipo}`;
  resultado.innerHTML = html;
  resultado.hidden = false;
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const corpo = {
    peso: form.peso.value,
    altura: form.altura.value,
  };

  try {
    const resposta = await fetch('/api/imc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      const itens = dados.erros.map((e) => `<li>${e}</li>`).join('');
      return mostrar(`<ul>${itens}</ul>`, 'erro');
    }

    const imc = dados.imc.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    mostrar(
      `<p class="valor">${imc} <small>kg/m²</small></p>
       <p class="classe">${dados.classificacao}</p>`,
      dados.classificacao.toLowerCase()
    );
  } catch {
    mostrar('<p>Não foi possível falar com a API. Ela está rodando?</p>', 'erro');
  }
});
