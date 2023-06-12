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

// Função para consultar o estoque de um produto
function consultarEstoque() {
    var codigo = document.getElementById("consultaCodigo").value;
    var estoqueAtual = obterEstoqueProduto(codigo);
    document.getElementById("estoqueAtual").innerText = "Estoque Atual: " + estoqueAtual;
  }
  
  // Função para obter o estoque de um produto
  function obterEstoqueProduto(codigo) {
    var tabela = document.getElementById("tabelaProdutos");
  
    for (var i = 1; i < tabela.rows.length; i++) {
      var codCell = tabela.rows[i].cells[0];
      if (codCell.innerHTML === codigo) {
        var quantidadeCell = tabela.rows[i].cells[2];
        return quantidadeCell.innerHTML;
      }
    }
  
    return "Produto não encontrado";
  }

// Função para buscar produtos por nome
function buscarPorNome() {
    var nome = document.getElementById("consultaNome").value;
    var produtos = buscarProdutosPorNome(nome);
    exibirProdutosNaTabela(produtos);
  }
  
  // Função para buscar produtos por categoria
  function buscarPorCategoria() {
    var categoria = document.getElementById("consultaCategoria").value;
    var produtos = buscarProdutosPorCategoria(categoria);
    exibirProdutosNaTabela(produtos);
  }
  
  // Função para buscar produtos por nome
  function buscarProdutosPorNome(nome) {
    var tabela = document.getElementById("tabelaProdutos");
    var produtos = [];
  
    for (var i = 1; i < tabela.rows.length; i++) {
      var nomeCell = tabela.rows[i].cells[1];
      if (nomeCell.innerHTML.toLowerCase().includes(nome.toLowerCase())) {
        var produto = obterDadosProduto(tabela.rows[i]);
        produtos.push(produto);
      }
    }
  
    return produtos;
  }
  
  // Função para buscar produtos por categoria
  function buscarProdutosPorCategoria(categoria) {
    var tabela = document.getElementById("tabelaProdutos");
    var produtos = [];
  
    for (var i = 1; i < tabela.rows.length; i++) {
      var categoriaCell = tabela.rows[i].cells[5];
      if (categoriaCell.innerHTML.toLowerCase().includes(categoria.toLowerCase())) {
        var produto = obterDadosProduto(tabela.rows[i]);
        produtos.push(produto);
      }
    }
  
    return produtos;
  }
  
  // Função para exibir todos os produtos na tabela
  function exibirTabelaCompleta() {
    var produtos = obterTodosProdutos();
    exibirProdutosNaTabela(produtos);
  }
  
  // Função para obter todos os produtos
  function obterTodosProdutos() {
    var tabela = document.getElementById("tabelaProdutos");
    var produtos = [];
  
    for (var i = 1; i < tabela.rows.length; i++) {
      var produto = obterDadosProduto(tabela.rows[i]);
      produtos.push(produto);
    }
  
    return produtos;
  }
  
  // Função para obter os dados de um produto a partir de uma linha da tabela
  function obterDadosProduto(row) {
    var cod = row.cells[0].innerHTML;
    var nome = row.cells[1].innerHTML;
    var quantidade = row.cells[2].innerHTML;
    var valor = row.cells[3].innerHTML;
    var descricao = row.cells[4].innerHTML;
    var categoria = row.cells[5].innerHTML;
  
    return {
      cod: cod,
      nome: nome,
      quantidade: quantidade,
      valor: valor,
      descricao: descricao,
      categoria: categoria
    };
  }
  
  // Função para exibir os produtos na tabela
  function exibirProdutosNaTabela(produtos) {
    var tabela = document.getElementById("tabelaProdutos");
  
    // Limpa a tabela
    while (tabela.rows.length > 1) {
      tabela.deleteRow(1);
    }
  
    // Preenche a tabela com os produtos
    for (var i = 0; i < produtos.length; i++) {
      var produto = produtos[i];
  
      var row = tabela.insertRow();
  
      var codCell = row.insertCell();
      codCell.innerHTML = produto.cod;
  
      var nomeCell = row.insertCell();
      nomeCell.innerHTML = produto.nome;
  
      var quantidadeCell = row.insertCell();
      quantidadeCell.innerHTML = produto.quantidade;
  
      var valorCell = row.insertCell();
      valorCell.innerHTML = produto.valor;
  
      var descricaoCell = row.insertCell();
      descricaoCell.innerHTML = produto.descricao;
  
      var categoriaCell = row.insertCell();
      categoriaCell.innerHTML = produto.categoria;
  
      var acoesCell = row.insertCell();
      acoesCell.innerHTML = '<button onclick="excluirProduto(this)">Excluir</button>' +
                            '<button onclick="venderProduto(this)">Vender</button>';
    }
  }
  