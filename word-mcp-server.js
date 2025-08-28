#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Cria o servidor MCP
const server = new Server(
  {
    name: 'word-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define as ferramentas disponíveis
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_document',
      description: 'Cria um novo documento Word',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título do documento' },
          content: { type: 'string', description: 'Conteúdo do documento' },
        },
        required: ['title', 'content'],
      },
    },
    {
      name: 'read_document',
      description: 'Lê o conteúdo de um documento Word',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Caminho do arquivo Word' },
        },
        required: ['path'],
      },
    },
    {
      name: 'update_document',
      description: 'Atualiza um documento Word existente',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Caminho do arquivo Word' },
          content: { type: 'string', description: 'Novo conteúdo' },
          append: { type: 'boolean', description: 'Adicionar ao final do documento' },
        },
        required: ['path', 'content'],
      },
    },
  ],
}));

// Implementa o handler para chamadas de ferramentas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'create_document': {
      try {
        // Aqui você implementaria a lógica para criar um documento Word
        // Por exemplo, usando a biblioteca docx
        return {
          content: [
            {
              type: 'text',
              text: `Documento "${args.title}" criado com sucesso!`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao criar documento: ${error.message}`,
            },
          ],
        };
      }
    }

    case 'read_document': {
      try {
        // Implementar leitura de documento Word
        return {
          content: [
            {
              type: 'text',
              text: `Conteúdo do documento em ${args.path}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao ler documento: ${error.message}`,
            },
          ],
        };
      }
    }

    case 'update_document': {
      try {
        // Implementar atualização de documento Word
        return {
          content: [
            {
              type: 'text',
              text: `Documento em ${args.path} atualizado com sucesso!`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao atualizar documento: ${error.message}`,
            },
          ],
        };
      }
    }

    default:
      throw new Error(`Ferramenta desconhecida: ${name}`);
  }
});

// Inicia o servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Servidor MCP Word iniciado');
}

main().catch(console.error);