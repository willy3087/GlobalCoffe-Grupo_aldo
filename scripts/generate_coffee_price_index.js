/**
 * Script para recuperar conteúdo do MCP Memory Service e gerar arquivo HTML com índice dinâmico
 */

const fs = require("fs");
const path = require("path");

// Função simulada para recuperar conteúdo do MCP Memory Service
// No ambiente real, substituir pela chamada real ao MCP Memory Service
async function fetchMemoryContent() {
  // Simulação: substituir por chamada real ao MCP Memory Service
  // usando o identificador de contexto fornecido
  return `# Fatores Determinantes do Preço do Café Commodity

## Introdução

O preço do café commodity é influenciado por diversos fatores que envolvem aspectos climáticos, econômicos, políticos e de mercado.

## Fatores Climáticos

### Condições Meteorológicas

As condições meteorológicas, como temperatura, precipitação e eventos extremos, impactam diretamente a produção e qualidade do café.

### Mudanças Climáticas

Mudanças climáticas de longo prazo alteram padrões de cultivo e produtividade.

## Fatores Econômicos

### Oferta e Demanda

A relação entre oferta e demanda global determina a tendência dos preços.

### Custos de Produção

Custos com insumos, mão de obra e logística influenciam o preço final.

## Fatores Políticos

### Políticas Comerciais

Tarifas, subsídios e acordos comerciais afetam o comércio internacional do café.

### Estabilidade Política

Conflitos e instabilidade podem gerar volatilidade nos preços.

## Conclusão

A compreensão desses fatores é essencial para análise e previsão dos preços do café commodity.
`;
}

// Função para gerar HTML com índice dinâmico a partir do conteúdo markdown
function generateHTML(content) {
  // Converter markdown simples para HTML com títulos e parágrafos
  // Para simplicidade, vamos usar regex para extrair títulos e gerar índice
  const lines = content.split("\n");
  let htmlContent = "";
  let toc = "<nav><h2>Índice</h2><ul>";

  let idCount = 0;
  const idMap = {};

  lines.forEach((line) => {
    let match = line.match(/^(#{1,6})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // Gerar id único para o título
      let id = text.toLowerCase().replace(/[^\w]+/g, "-");
      if (idMap[id]) {
        idCount++;
        id = `${id}-${idCount}`;
      }
      idMap[id] = true;

      // Adicionar ao índice
      toc += `<li class="level-${level}"><a href="#${id}">${text}</a></li>`;

      // Adicionar título ao conteúdo HTML
      htmlContent += `<h${level} id="${id}">${text}</h${level}>\n`;
    } else if (line.trim() === "") {
      htmlContent += "<br/>\n";
    } else {
      htmlContent += `<p>${line}</p>\n`;
    }
  });

  toc += "</ul></nav>";

  // HTML completo com estilo básico e script para navegação suave
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Fatores Determinantes do Preço do Café Commodity</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  nav { position: fixed; top: 20px; left: 20px; width: 250px; max-height: 90vh; overflow-y: auto; background: #f9f9f9; padding: 10px; border: 1px solid #ddd; }
  nav h2 { font-size: 1.2em; margin-top: 0; }
  nav ul { list-style: none; padding-left: 0; }
  nav li { margin: 5px 0; }
  nav li.level-1 { font-weight: bold; }
  nav li.level-2 { margin-left: 10px; }
  nav li.level-3 { margin-left: 20px; }
  nav a { text-decoration: none; color: #007acc; }
  nav a:hover { text-decoration: underline; }
  main { margin-left: 280px; max-width: 700px; }
  h1, h2, h3, h4, h5, h6 { scroll-margin-top: 80px; }
</style>
</head>
<body>
${toc}
<main>
${htmlContent}
</main>
<script>
  // Navegação suave para links do índice
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById(this.getAttribute('href').substring(1));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
      }
    });
  });
</script>
</body>
</html>`;

  return html;
}

async function main() {
  const content = await fetchMemoryContent();
  const html = generateHTML(content);

  const outputPath = path.join(
    __dirname,
    "..",
    "Pesquisa_Mercado",
    "indice_fatores_preco_cafe.html"
  );
  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`Arquivo HTML gerado em: ${outputPath}`);
}

main().catch(console.error);
