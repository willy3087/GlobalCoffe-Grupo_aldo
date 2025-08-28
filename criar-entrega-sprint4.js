import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import fs from 'fs/promises';

async function createSprintDeliveryDocument() {
  console.log('Criando documento de entrega da Sprint 4...');

  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Título Principal
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Entrega Sprint 4 - Projeto GlobalCoffee',
                  bold: true,
                  size: 36,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            
            // Subtítulo
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Consolidação de Entregas e Resultados',
                  size: 28,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),

            // TASK 1: Criação de Personas
            new Paragraph({
              children: [
                new TextRun({
                  text: 'TASK 1: CRIAÇÃO DE PERSONAS',
                  bold: true,
                  size: 32,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Compilação de Dados e Desenho de Personas Iniciais',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: 'Foram desenvolvidas 6 personas principais para o projeto GlobalCoffee, divididas em dois grupos: Produtores de Café e Cooperativas Cafeeiras.',
              spacing: { after: 200 },
            }),

            // Personas de Produtores
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Personas de Produtores:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '• José Silva - Pequeno Produtor Familiar Tradicional',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Perfil tecnológico básico, baixa familiaridade digital',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Suporte intensivo no onboarding',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Comunicação via cooperativa',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Roberto Santos - Médio Produtor Conectado',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Perfil tecnológico intermediário',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Dashboard personalizado e ferramentas de gestão',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Acesso a mercados premium',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Ana Carolina Lima - Jovem Produtora Inovadora',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Perfil digital nativo, foco em cafés especiais',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Ferramentas para diferenciação e construção de marca',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Acesso a crédito jovem e modernização',
              bullet: { level: 1 },
              spacing: { after: 200 },
            }),

            // Personas de Cooperativas
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Personas de Cooperativas:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '• Persona A - Pequena Cooperativa Regional',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Até 1.500 membros, recepção <80.000 sacas/ano',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Módulo financeiro plug-and-play',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Rastreabilidade QR-Code + blockchain',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Persona B - Grande Cooperativa Exportadora',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Exemplo: Cooxupé, >19.000 membros',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - TI corporativa avançada (Dynamics 365)',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Nó privado Hyperledger para rastreamento',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Persona C - Consórcio Digital de Cooperativas',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Exemplo: Supercampo, 12 cooperativas',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Plataforma VTEX multitenant',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Tokenização de recebíveis (Coffee Coin-like)',
              bullet: { level: 1 },
              spacing: { after: 400 },
            }),

            // TASK 2: Definição do Problema
            new Paragraph({
              children: [
                new TextRun({
                  text: 'TASK 2: DEFINIÇÃO DO PROBLEMA',
                  bold: true,
                  size: 32,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Insights de Dados e Pontos de Dor Identificados',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Principais Problemas Identificados:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '• Volatilidade Extrema de Preços',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Variação de R$ 250 para R$ 2.500 em 12 meses',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Especulação financeira amplifica volatilidade em 40-60%',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Fragmentação da Cadeia Produtiva',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Diversos perfis tecnológicos e regionais',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Apenas 25% das cooperativas digitalizadas',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Riscos Climáticos Crescentes',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Geadas no Brasil: perdas de 30-40% da produção',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Eventos extremos intensificados em 70% nas últimas décadas',
              bullet: { level: 1 },
            }),

            new Paragraph({
              text: '• Barreiras de Acesso a Mercados Premium',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '  - Falta de certificações ESG',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Ausência de rastreabilidade digital',
              bullet: { level: 1 },
            }),
            new Paragraph({
              text: '  - Certificações agregam prêmio de 15-30% no preço',
              bullet: { level: 1 },
              spacing: { after: 200 },
            }),

            // Mapa de Jornada
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Jornada do Produtor Identificada:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '1. Pré-Plantio: Análise de solo, clima e mercado',
            }),
            new Paragraph({
              text: '2. Plantio e Cultivo: Monitoramento climático contínuo',
            }),
            new Paragraph({
              text: '3. Colheita: Otimização do timing baseado em dados',
            }),
            new Paragraph({
              text: '4. Beneficiamento: Rastreabilidade e certificações',
            }),
            new Paragraph({
              text: '5. Comercialização: Acesso a múltiplos canais de venda',
            }),
            new Paragraph({
              text: '6. Pós-Venda: Análise de resultados e planejamento',
              spacing: { after: 400 },
            }),

            // TASK 3: Workshop de Ideação
            new Paragraph({
              children: [
                new TextRun({
                  text: 'TASK 3: WORKSHOP DE IDEAÇÃO',
                  bold: true,
                  size: 32,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Materiais e Outputs do Workshop',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Metodologia Utilizada:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: 'Foi aplicada a metodologia Duplo Diamante (Design Thinking) com as seguintes fases:',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '• Descobrir: Pesquisa com 50+ produtores e 12 cooperativas',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Definir: Mapeamento de 24 pontos de dor principais',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Desenvolver: 120+ ideias geradas em sessões de brainstorming',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Entregar: 15 funcionalidades priorizadas para MVP',
              bullet: { level: 0 },
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Principais Outputs do Workshop:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '• Sistema de Alertas Climáticos Simplificados',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Dashboard KPIs para Cooperativas',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Marketplace B2B para Café Verde',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Rastreabilidade Blockchain + QR Code',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• API de Integração com Sistemas Legados',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '• Mobile App Offline-First',
              bullet: { level: 0 },
              spacing: { after: 400 },
            }),

            // TASK 4: Priorização MVP
            new Paragraph({
              children: [
                new TextRun({
                  text: 'TASK 4: PRIORIZAÇÃO DE FUNCIONALIDADE (MVP)',
                  bold: true,
                  size: 32,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Problema Central e Backlog do MVP',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Problema Central Definido:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '"Como conectar de forma eficiente e sustentável produtores de café de diferentes perfis tecnológicos com o mercado global, mitigando riscos climáticos e de preço, enquanto promove rastreabilidade e certificações ESG?"',
              italics: true,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Funcionalidades Priorizadas (MoSCoW):',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            // Tabela de Priorização
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ 
                        text: 'Funcionalidade',
                        bold: true,
                      })],
                      width: { size: 40, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: 'Prioridade',
                        bold: true,
                      })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: 'ROI Estimado',
                        bold: true,
                      })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: 'Sprint',
                        bold: true,
                      })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('API de Preços Real-time')] }),
                    new TableCell({ children: [new Paragraph('Must Have')] }),
                    new TableCell({ children: [new Paragraph('45%')] }),
                    new TableCell({ children: [new Paragraph('1-2')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('EUDR Compliance Scanner')] }),
                    new TableCell({ children: [new Paragraph('Must Have')] }),
                    new TableCell({ children: [new Paragraph('60%')] }),
                    new TableCell({ children: [new Paragraph('7-8')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Sistema de Assinatura Digital')] }),
                    new TableCell({ children: [new Paragraph('Must Have')] }),
                    new TableCell({ children: [new Paragraph('50%')] }),
                    new TableCell({ children: [new Paragraph('3-4')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Blockchain QR Code')] }),
                    new TableCell({ children: [new Paragraph('Should Have')] }),
                    new TableCell({ children: [new Paragraph('25%')] }),
                    new TableCell({ children: [new Paragraph('3-4')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Integração PIX/Mobile Money')] }),
                    new TableCell({ children: [new Paragraph('Should Have')] }),
                    new TableCell({ children: [new Paragraph('35%')] }),
                    new TableCell({ children: [new Paragraph('5-6')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('App Mobile Offline-First')] }),
                    new TableCell({ children: [new Paragraph('Must Have')] }),
                    new TableCell({ children: [new Paragraph('40%')] }),
                    new TableCell({ children: [new Paragraph('9-10')] }),
                  ],
                }),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),

            new Paragraph({
              text: '',
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Backlog Inicial do MVP:',
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '1. Sistema de Autenticação e Onboarding Diferenciado',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '2. API de Preços com Dados de 5 Bolsas Globais',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '3. Alertas Climáticos com IA Preditiva',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '4. Dashboard KPIs para Cooperativas',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '5. Módulo de Certificação Digital ESG',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '6. Sistema de Pagamentos Integrado',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '7. Rastreabilidade End-to-End',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '8. Analytics e Relatórios Customizados',
              bullet: { level: 0 },
              spacing: { after: 400 },
            }),

            // Conclusão
            new Paragraph({
              children: [
                new TextRun({
                  text: 'CONCLUSÃO',
                  bold: true,
                  size: 32,
                  font: 'Arial',
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            new Paragraph({
              text: 'A Sprint 4 do projeto GlobalCoffee entregou com sucesso todos os artefatos planejados:',
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: '✓ 6 personas detalhadas com funcionalidades específicas',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '✓ Análise aprofundada dos problemas do mercado cafeeiro',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '✓ Workshop de ideação com 120+ ideias e 15 funcionalidades priorizadas',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '✓ MVP definido com backlog priorizado e roadmap de 12 meses',
              bullet: { level: 0 },
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: 'O projeto está pronto para iniciar a fase de desenvolvimento, com foco inicial na API de preços real-time e sistema de alertas climáticos, atendendo às necessidades mais críticas identificadas durante a pesquisa.',
              spacing: { after: 400 },
            }),
          ],
        },
      ],
    });

    // Gera o documento
    const buffer = await Packer.toBuffer(doc);
    
    // Salva o arquivo
    const filename = 'entrega-sprint-4-globalcoffee.docx';
    await fs.writeFile(filename, buffer);
    
    console.log(`✓ Documento de entrega criado com sucesso: ${filename}`);
    console.log(`✓ Tamanho do arquivo: ${buffer.length} bytes`);
    
  } catch (error) {
    console.error('Erro ao criar documento:', error);
  }
}

// Executa a função
createSprintDeliveryDocument();