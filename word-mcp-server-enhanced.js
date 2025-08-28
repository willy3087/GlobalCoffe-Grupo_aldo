#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import fs from 'fs/promises';
import path from 'path';

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
      name: 'create_word_document',
      description: 'Cria um novo documento Word com formatação',
      inputSchema: {
        type: 'object',
        properties: {
          filepath: { type: 'string', description: 'Caminho onde salvar o arquivo' },
          title: { type: 'string', description: 'Título do documento' },
          paragraphs: {
            type: 'array',
            description: 'Lista de parágrafos',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                heading: { type: 'string', enum: ['Title', 'Heading1', 'Heading2', 'Heading3'] },
                bold: { type: 'boolean' },
                italic: { type: 'boolean' },
                fontSize: { type: 'number' },
              },
              required: ['text'],
            },
          },
        },
        required: ['filepath', 'title', 'paragraphs'],
      },
    },
    {
      name: 'add_table_to_document',
      description: 'Adiciona uma tabela a um documento Word',
      inputSchema: {
        type: 'object',
        properties: {
          filepath: { type: 'string', description: 'Caminho do arquivo Word' },
          tableData: {
            type: 'array',
            description: 'Dados da tabela (array de arrays)',
            items: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          headers: {
            type: 'array',
            description: 'Cabeçalhos da tabela',
            items: { type: 'string' },
          },
        },
        required: ['filepath', 'tableData'],
      },
    },
    {
      name: 'convert_to_pdf',
      description: 'Converte um documento Word para PDF',
      inputSchema: {
        type: 'object',
        properties: {
          wordPath: { type: 'string', description: 'Caminho do arquivo Word' },
          pdfPath: { type: 'string', description: 'Caminho de saída do PDF' },
        },
        required: ['wordPath', 'pdfPath'],
      },
    },
  ],
}));

// Implementa o handler para chamadas de ferramentas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'create_word_document': {
      try {
        const paragraphs = args.paragraphs.map((para) => {
          const children = [];
          
          if (para.text) {
            children.push(
              new TextRun({
                text: para.text,
                bold: para.bold || false,
                italics: para.italic || false,
                size: para.fontSize ? para.fontSize * 2 : 24, // docx usa half-points
              })
            );
          }

          return new Paragraph({
            children,
            heading: para.heading,
          });
        });

        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: args.title,
                      bold: true,
                      size: 32,
                    }),
                  ],
                  heading: 'Title',
                }),
                ...paragraphs,
              ],
            },
          ],
        });

        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(args.filepath, buffer);

        return {
          content: [
            {
              type: 'text',
              text: `Documento Word criado com sucesso em: ${args.filepath}`,
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

    case 'add_table_to_document': {
      try {
        // Esta é uma implementação simplificada
        // Em um caso real, você precisaria ler o documento existente e adicionar a tabela
        return {
          content: [
            {
              type: 'text',
              text: `Funcionalidade de adicionar tabela ainda em desenvolvimento`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao adicionar tabela: ${error.message}`,
            },
          ],
        };
      }
    }

    case 'convert_to_pdf': {
      try {
        // Nota: Conversão para PDF requer ferramentas adicionais como LibreOffice
        return {
          content: [
            {
              type: 'text',
              text: `Para converter para PDF, você precisará de ferramentas adicionais como LibreOffice instalado no sistema`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro na conversão: ${error.message}`,
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
  console.error('Servidor MCP Word Enhanced iniciado');
}

main().catch(console.error);