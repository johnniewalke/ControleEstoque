// Carrega a API do Google Sheets
gapi.load('client', init);

// Inicializa a API do Google Sheets
function init() {
  gapi.client.init({
    apiKey: 'SUA_API_KEY',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    clientId: 'SEU_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  }).then(function() {
    // API inicializada com sucesso
    console.log('API do Google Sheets inicializada.');
    carregarProdutos();
  }, function(error) {
    // Erro ao inicializar a API
    console.log('Erro ao inicializar a API do Google Sheets: ' + error);
  });
}

// Variáveis globais
var tabela = document.getElementById("tabelaProdutos");
var codInput = document.getElementById("codigo");
var nomeInput = document.getElementById("nome");
var quantidadeInput = document.getElementById("quantidade");
var valorInput = document.getElementById("valor");
var descricaoInput = document.getElementById("descricao");
var categoriaInput = document.getElementById("categoria");

// ID da planilha do Google Sheets
var spreadsheetId = 'ID_DA_PLANILHA';

// Nome da planilha que contém os produtos
var sheetName = 'Nome_da_Planilha';

// Função para carregar os produtos do Google Sheets na tabela
function carregarProdutos() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetName
  }).then(function(response) {
    var produtos = response.result.values;

    if (produtos && produtos.length > 0) {
      for (var i = 0; i < produtos.length; i++) {
        var produto = produtos[i];

        var cod = produto[0];
        var nome = produto[1];
        var quantidade = produto[2];
        var valor = produto[3];
        var descricao = produto[4];
        var categoria = produto[5];

        adicionarProdutoTabela(cod, nome, quantidade, valor, descricao, categoria);
      }
    }
  }, function(error) {
    console.log('Erro ao carregar os produtos: ' + error.result.error.message);
  });
}

// Função para adicionar um novo produto
function adicionarProduto() {
  var cod = codInput.value;
  var nome = nomeInput.value;
  var quantidade = quantidadeInput.value;
  var valor = valorInput.value;
  var descricao = descricaoInput.value;
  var categoria = categoriaInput.value;

  adicionarProdutoTabela(cod, nome, quantidade, valor, descricao, categoria);

  // Limpa os campos do formulário
  codInput.value = "";
  nomeInput.value = "";
  quantidadeInput.value = "";
  valorInput.value = "";
  descricaoInput.value = "";
  categoriaInput.value = "";

  // Adiciona o produto ao Google Sheets
  adicionarProdutoPlanilha(cod, nome, quantidade, valor, descricao, categoria);
}

// Função para adicionar um novo produto à tabela
function adicionarProdutoTabela(cod, nome, quantidade, valor, descricao, categoria) {
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
}

// Função para adicionar um novo produto à planilha do Google Sheets
function adicionarProdutoPlanilha(cod, nome, quantidade, valor, descricao, categoria) {
  var values = [[cod, nome, quantidade, valor, descricao, categoria]];

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
  }).then(function(response) {
    console.log('Produto adicionado com sucesso.');
  }, function(error) {
    console.log('Erro ao adicionar o produto: ' + error.result.error.message);
  });
}

// Função para excluir um produto
function excluirProduto(button) {
  var row = button.parentNode.parentNode;
  var codCell = row.cells[0];
  var cod = codCell.innerHTML;

  tabela.deleteRow(row.rowIndex);

  // Exclui o produto do Google Sheets
  excluirProdutoPlanilha(cod);
}

// Função para excluir um produto da planilha do Google Sheets
function excluirProdutoPlanilha(cod) {
  var values = [[cod]];

  gapi.client.sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: {
      valueInputOption: 'USER_ENTERED',
      data: [{
        range: sheetName,
        majorDimension: 'ROWS',
        values: values
      }]
    }
  }).then(function(response) {
    console.log('Produto excluído com sucesso.');
  }, function(error) {
    console.log('Erro ao excluir o produto: ' + error.result.error.message);
  });
}

// Função para vender um produto (subtrai 1 da quantidade)
function venderProduto(button) {
  var row = button.parentNode.parentNode;
  var quantidadeCell = row.cells[2];
  var quantidade = parseInt(quantidadeCell.innerHTML);

  if (quantidade > 0) {
    quantidadeCell.innerHTML = quantidade - 1;
    
    // Atualiza a quantidade do produto no Google Sheets
    var codCell = row.cells[0];
    var cod = codCell.innerHTML;
    atualizarQuantidadeProdutoPlanilha(cod, quantidade - 1);
  }
}

// Função para atualizar a quantidade de um produto na planilha do Google Sheets
function atualizarQuantidadeProdutoPlanilha(cod, quantidade) {
  var range = sheetName + "!C:C";
  var values = [[quantidade]];

  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
  }).then(function(response) {
    console.log('Quantidade do produto atualizada com sucesso.');
  }, function(error) {
    console.log('Erro ao atualizar a quantidade do produto: ' + error.result.error.message);
  });
}
