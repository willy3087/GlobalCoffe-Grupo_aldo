import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import fs from 'fs/promises';

async function createSimpleDocument() {
  console.log('Criando documento Word simples...');

  try {
    // Cria um novo documento
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Título principal
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Documento GlobalCoffee',
                  bold: true,
                  size: 32,
                }),
              ],
              heading: HeadingLevel.TITLE,
            }),
            
            // Parágrafo vazio para espaçamento
            new Paragraph({ text: '' }),
            
            // Subtítulo
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Relatório de Teste',
                  bold: true,
                  size: 28,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
            }),
            
            // Conteúdo
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Este documento foi criado usando a biblioteca docx no projeto GlobalCoffee. ',
                }),
                new TextRun({
                  text: 'Este texto está em negrito. ',
                  bold: true,
                }),
                new TextRun({
                  text: 'Este texto está em itálico.',
                  italics: true,
                }),
              ],
            }),
            
            // Mais um parágrafo
            new Paragraph({
              text: 'O MCP (Model Context Protocol) foi configurado com sucesso para manipular documentos Word!',
              spacing: {
                after: 200,
              },
            }),
            
            // Lista de recursos
            new Paragraph({
              text: 'Recursos disponíveis:',
              heading: HeadingLevel.HEADING_2,
            }),
            
            new Paragraph({
              text: '• Criar documentos Word',
              bullet: {
                level: 0,
              },
            }),
            
            new Paragraph({
              text: '• Adicionar formatação (negrito, itálico, tamanhos)',
              bullet: {
                level: 0,
              },
            }),
            
            new Paragraph({
              text: '• Criar cabeçalhos e estrutura',
              bullet: {
                level: 0,
              },
            }),
            
            new Paragraph({
              text: '• Exportar para arquivo .docx',
              bullet: {
                level: 0,
              },
            }),
          ],
        },
      ],
    });

    // Converte o documento para buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Salva o arquivo
    const filename = 'globalcoffee-documento-teste.docx';
    await fs.writeFile(filename, buffer);
    
    console.log(`✓ Documento criado com sucesso: ${filename}`);
    console.log(`✓ Tamanho do arquivo: ${buffer.length} bytes`);
    
  } catch (error) {
    console.error('Erro ao criar documento:', error);
  }
}

// Executa a função
createSimpleDocument();