function alterarTema() {
    var select = document.getElementById("theme");
    var theme = select.options[select.selectedIndex].value;
    var themeStyles = document.getElementById("themeStyles");
    themeStyles.href = "styles-" + theme + ".css";
  }
  