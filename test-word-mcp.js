import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testWordMCP() {
  console.log('Iniciando teste do MCP Word...');
  
  // Cria o transporte para comunicação com o servidor
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['./word-mcp-server-enhanced.js'],
  });

  // Cria o cliente MCP
  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  }, {
    capabilities: {}
  });

  try {
    // Conecta ao servidor
    await client.connect(transport);
    console.log('Conectado ao servidor MCP!');

    // Lista as ferramentas disponíveis
    const tools = await client.listTools();
    console.log('\nFerramentas disponíveis:');
    tools.tools.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });

    // Testa a criação de um documento
    console.log('\nCriando documento de teste...');
    const result = await client.callTool('create_word_document', {
      filepath: './teste-documento.docx',
      title: 'Documento de Teste MCP',
      paragraphs: [
        {
          text: 'Este é um teste do servidor MCP para Word.',
          bold: false
        },
        {
          text: 'Recursos Implementados',
          heading: 'Heading1',
          bold: true
        },
        {
          text: 'O servidor pode criar documentos com formatação rica.',
          italic: true
        },
        {
          text: 'Incluindo diferentes tamanhos de fonte.',
          fontSize: 14
        }
      ]
    });

    console.log('Resultado:', result.content[0].text);

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    // Desconecta do servidor
    await client.close();
    console.log('\nTeste concluído!');
  }
}

// Executa o teste
testWordMCP().catch(console.error);