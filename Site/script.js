// Variáveis globais
var tabela = document.getElementById("tabelaProdutos");
var codInput = document.getElementById("codigo");
var nomeInput = document.getElementById("nome");
var quantidadeInput = document.getElementById("quantidade");
var valorInput = document.getElementById("valor");
var descricaoInput = document.getElementById("descricao");
var categoriaInput = document.getElementById("categoria");

// Função para adicionar um novo produto
function adicionarProduto() {
  var cod = codInput.value;
  var nome = nomeInput.value;
  var quantidade = quantidadeInput.value;
  var valor = valorInput.value;
  var descricao = descricaoInput.value;
  var categoria = categoriaInput.value;

  // Cria uma nova linha na tabela
  var row = tabela.insertRow();

  // Insere as células com os valores do produto
  var codCell = row.insertCell(0);
  codCell.innerHTML = cod;
  
  var nomeCell = row.insertCell(1);
  nomeCell.innerHTML = nome;
  
  var quantidadeCell = row.insertCell(2);
  quantidadeCell.innerHTML = quantidade;
  
  var valorCell = row.insertCell(3);
  valorCell.innerHTML = valor;
  
  var descricaoCell = row.insertCell(4);
  descricaoCell.innerHTML = descricao;
  
  var categoriaCell = row.insertCell(5);
  categoriaCell.innerHTML = categoria;
  
  var acoesCell = row.insertCell(6);
  acoesCell.innerHTML = '<button onclick="excluirProduto(this)">Excluir</button> <button onclick="venderProduto(this)">Vender</button>';

  // Limpa os campos do formulário
  codInput.value = "";
  nomeInput.value = "";
  quantidadeInput.value = "";
  valorInput.value = "";
  descricaoInput.value = "";
  categoriaInput.value = "";
}

// Função para excluir um produto
function excluirProduto(button) {
  var row = button.parentNode.parentNode;
  tabela.deleteRow(row.rowIndex);
}

// Função para vender um produto (subtrai 1 da quantidade)
function venderProduto(button) {
  var row = button.parentNode.parentNode;
  var quantidadeCell = row.cells[2];
  var quantidade = parseInt(quantidadeCell.innerHTML);

  if (quantidade > 0) {
    quantidadeCell.innerHTML = quantidade - 1;
  }
}
