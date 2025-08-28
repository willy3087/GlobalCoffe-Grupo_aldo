const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Mapeamento das páginas do Markdown Guide
const markdownPages = [
  { name: 'getting-started', url: 'https://www.markdownguide.org/getting-started/' },
  { name: 'cheat-sheet', url: 'https://www.markdownguide.org/cheat-sheet/' },
  { name: 'basic-syntax', url: 'https://www.markdownguide.org/basic-syntax/' },
  { name: 'extended-syntax', url: 'https://www.markdownguide.org/extended-syntax/' },
  { name: 'hacks', url: 'https://www.markdownguide.org/hacks/' },
  { name: 'tools', url: 'https://www.markdownguide.org/tools/' }
];

// Mapeamento das páginas do Mermaid
const mermaidPages = [
  { name: 'intro', url: 'https://docs.mermaidchart.com/mermaid/intro' },
  { name: 'flowchart', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/flowchart' },
  { name: 'sequence-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/sequence-diagram' },
  { name: 'class-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/classDiagram' },
  { name: 'state-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/stateDiagram' },
  { name: 'entity-relationship-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/entityRelationshipDiagram' },
  { name: 'user-journey', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/userJourney' },
  { name: 'gantt', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/gantt' },
  { name: 'pie-chart', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/pie' },
  { name: 'quadrant-chart', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/quadrantChart' },
  { name: 'requirement-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/requirementDiagram' },
  { name: 'gitgraph', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/gitgraph' },
  { name: 'c4-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/c4' },
  { name: 'mindmaps', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/mindmap' },
  { name: 'timeline', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/timeline' },
  { name: 'zenuml', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/zenuml' },
  { name: 'sankey', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/sankey' },
  { name: 'xy-chart', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/xyChart' },
  { name: 'block-diagram', url: 'https://docs.mermaidchart.com/mermaid/diagram-syntax/block' },
  { name: 'configuration', url: 'https://docs.mermaidchart.com/mermaid/config/configuration' },
  { name: 'theming', url: 'https://docs.mermaidchart.com/mermaid/config/theming' },
  { name: 'accessibility', url: 'https://docs.mermaidchart.com/mermaid/config/accessibility' }
];

async function scrapeContent(browser, url, selector = 'main, article, .content, body') {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Aguarda o conteúdo principal carregar
    await page.waitForSelector(selector, { timeout: 5000 }).catch(() => {});

    // Extrai o conteúdo texto e estrutura
    const content = await page.evaluate((sel) => {
      const element = document.querySelector(sel) || document.body;

      // Função para extrair texto estruturado
      function extractStructuredText(el, level = 0) {
        const sections = [];
        let currentSection = { title: '', content: '', level: level };

        for (const child of el.children) {
          if (child.tagName.match(/^H[1-6]$/)) {
            if (currentSection.content) {
              sections.push(currentSection);
            }
            currentSection = {
              title: child.textContent.trim(),
              content: '',
              level: parseInt(child.tagName[1])
            };
          } else if (child.tagName === 'PRE' || child.tagName === 'CODE') {
            currentSection.content += '\n```\n' + child.textContent.trim() + '\n```\n';
          } else {
            currentSection.content += child.textContent.trim() + '\n';
          }
        }

        if (currentSection.content) {
          sections.push(currentSection);
        }

        return sections;
      }

      return {
        title: document.title,
        sections: extractStructuredText(element),
        fullText: element.textContent
      };
    }, selector);

    await page.close();
    return content;
  } catch (error) {
    console.error(`Erro ao processar ${url}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Iniciando download e vetorização das documentações...');

  const outputDir = path.resolve(__dirname, '../docs_vectorized');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Processar páginas do Markdown Guide
    console.log('\nProcessando Markdown Guide...');
    const markdownData = { source: 'markdown-guide', pages: [] };

    for (const page of markdownPages) {
      console.log(`- Baixando ${page.name}...`);
      const content = await scrapeContent(browser, page.url);
      if (content) {
        markdownData.pages.push({
          name: page.name,
          url: page.url,
          title: content.title,
          sections: content.sections
        });
      }
    }

    fs.writeFileSync(
      path.join(outputDir, 'markdown_guide_vectorized.json'),
      JSON.stringify(markdownData, null, 2),
      'utf-8'
    );
    console.log('✓ Markdown Guide vetorizado e salvo');

    // Processar páginas do Mermaid
    console.log('\nProcessando Mermaid Documentation...');
    const mermaidData = { source: 'mermaid-docs', pages: [] };

    for (const page of mermaidPages) {
      console.log(`- Baixando ${page.name}...`);
      const content = await scrapeContent(browser, page.url, '.theme-doc-markdown');
      if (content) {
        mermaidData.pages.push({
          name: page.name,
          url: page.url,
          title: content.title,
          sections: content.sections
        });
      }
    }

    fs.writeFileSync(
      path.join(outputDir, 'mermaid_docs_vectorized.json'),
      JSON.stringify(mermaidData, null, 2),
      'utf-8'
    );
    console.log('✓ Mermaid Documentation vetorizada e salva');

    // Criar índice combinado para consulta rápida
    const combinedIndex = {
      markdown: markdownData.pages.map(p => ({
        name: p.name,
        title: p.title,
        sections: p.sections.map(s => s.title)
      })),
      mermaid: mermaidData.pages.map(p => ({
        name: p.name,
        title: p.title,
        sections: p.sections.map(s => s.title)
      }))
    };

    fs.writeFileSync(
      path.join(outputDir, 'docs_index.json'),
      JSON.stringify(combinedIndex, null, 2),
      'utf-8'
    );
    console.log('✓ Índice de consulta rápida criado');

  } catch (error) {
    console.error('Erro durante o processamento:', error);
  } finally {
    await browser.close();
  }

  console.log('\nProcessamento concluído! Arquivos salvos em:', outputDir);
}

// Executar o script
main().catch(console.error);
