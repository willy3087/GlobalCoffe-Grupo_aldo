import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const baseDir = path.resolve(process.cwd());

// Palavras-chave para detectar relações entre documentos
const KEYWORDS_RELATIONS = {
  cafe: ['café', 'coffee', 'grão', 'arábica', 'robusta', 'cereja', 'torra'],
  producao: ['produção', 'plantio', 'colheita', 'safra', 'cultivo', 'lavoura'],
  mercado: ['mercado', 'preço', 'cotação', 'exportação', 'importação', 'comércio'],
  clima: ['clima', 'temperatura', 'chuva', 'seca', 'geada', 'weather', 'meteorologia'],
  cooperativa: ['cooperativa', 'cooperado', 'associação', 'grupo', 'união'],
  tecnologia: ['tecnologia', 'sistema', 'software', 'automação', 'digital', 'IA'],
  sustentabilidade: ['sustentável', 'orgânico', 'certificação', 'ambiental', 'social'],
  qualidade: ['qualidade', 'defeito', 'classificação', 'peneira', 'bebida', 'prova'],
};

interface DocumentNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  keywords?: string[];
  relatedTo?: string[];
}

interface MindMapNode {
  id: string;
  data: {
    label: string;
    path: string;
    type: 'file' | 'directory' | 'topic';
    keywords?: string[];
    strength?: number;
  };
  position: { x: number; y: number };
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  data?: {
    strength: number;
    keywords: string[];
  };
}

// Extrair palavras-chave de um texto
function extractKeywords(text: string): string[] {
  const foundKeywords: string[] = [];
  const lowerText = text.toLowerCase();
  
  Object.entries(KEYWORDS_RELATIONS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        if (!foundKeywords.includes(category)) {
          foundKeywords.push(category);
        }
      }
    });
  });
  
  return foundKeywords;
}

// Calcular similaridade entre dois conjuntos de palavras-chave
function calculateSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const intersection = keywords1.filter(k => keywords2.includes(k));
  const union = [...new Set([...keywords1, ...keywords2])];
  
  return intersection.length / union.length;
}

// Ler conteúdo de arquivo com limite
async function readFileContent(filePath: string, maxSize: number = 50000): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    if (stats.size > maxSize) {
      // Ler apenas o início do arquivo se for muito grande
      const buffer = Buffer.alloc(maxSize);
      const fileHandle = await fs.open(filePath, 'r');
      await fileHandle.read(buffer, 0, maxSize, 0);
      await fileHandle.close();
      return buffer.toString('utf-8');
    }
    
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    return '';
  }
}

// Processar documentos e extrair relações
async function processDocuments(dirPath: string, documents: DocumentNode[] = []): Promise<DocumentNode[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      // Ignorar diretórios não relevantes
      if (entry.name.startsWith('.') || 
          ['node_modules', '.git', '.next', 'GlobalCoffee_Reorganizado/temp'].some(ignored => 
            relativePath.includes(ignored))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await processDocuments(fullPath, documents);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.md', '.txt', '.docx'].includes(ext)) {
          const content = await readFileContent(fullPath);
          const keywords = extractKeywords(content);
          
          if (keywords.length > 0) {
            documents.push({
              id: relativePath,
              name: entry.name,
              path: relativePath,
              type: 'file',
              content: content.substring(0, 1000), // Guardar apenas preview
              keywords,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao processar documentos:', error);
  }
  
  return documents;
}

// Criar layout de mindmap baseado em relações
function createMindMapLayout(documents: DocumentNode[]): { nodes: MindMapNode[]; edges: MindMapEdge[] } {
  const nodes: MindMapNode[] = [];
  const edges: MindMapEdge[] = [];
  const topicNodes = new Map<string, MindMapNode>();
  
  // Criar nós de tópicos centrais
  const centerX = 400;
  const centerY = 300;
  const radius = 250;
  
  Object.keys(KEYWORDS_RELATIONS).forEach((topic, index) => {
    const angle = (index / Object.keys(KEYWORDS_RELATIONS).length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    const topicNode: MindMapNode = {
      id: `topic-${topic}`,
      data: {
        label: topic.charAt(0).toUpperCase() + topic.slice(1),
        path: '',
        type: 'topic',
      },
      position: { x, y },
    };
    
    nodes.push(topicNode);
    topicNodes.set(topic, topicNode);
  });
  
  // Adicionar documentos e criar conexões
  documents.forEach((doc, docIndex) => {
    if (!doc.keywords || doc.keywords.length === 0) return;
    
    // Calcular posição baseada nos tópicos relacionados
    let avgX = 0;
    let avgY = 0;
    let count = 0;
    
    doc.keywords.forEach(keyword => {
      const topicNode = topicNodes.get(keyword);
      if (topicNode) {
        avgX += topicNode.position.x;
        avgY += topicNode.position.y;
        count++;
      }
    });
    
    if (count > 0) {
      avgX /= count;
      avgY /= count;
      
      // Adicionar variação para evitar sobreposição
      const angleVariation = (docIndex / documents.length) * 2 * Math.PI;
      const distanceVariation = 50 + (docIndex % 3) * 30;
      
      const docNode: MindMapNode = {
        id: doc.id,
        data: {
          label: doc.name,
          path: doc.path,
          type: 'file',
          keywords: doc.keywords,
        },
        position: {
          x: avgX + distanceVariation * Math.cos(angleVariation),
          y: avgY + distanceVariation * Math.sin(angleVariation),
        },
      };
      
      nodes.push(docNode);
      
      // Criar edges para tópicos
      doc.keywords.forEach(keyword => {
        edges.push({
          id: `${doc.id}-topic-${keyword}`,
          source: doc.id,
          target: `topic-${keyword}`,
          data: {
            strength: 1 / doc.keywords.length,
            keywords: [keyword],
          },
        });
      });
    }
  });
  
  // Criar conexões entre documentos relacionados
  for (let i = 0; i < documents.length; i++) {
    for (let j = i + 1; j < documents.length; j++) {
      const doc1 = documents[i];
      const doc2 = documents[j];
      
      if (doc1.keywords && doc2.keywords) {
        const similarity = calculateSimilarity(doc1.keywords, doc2.keywords);
        
        if (similarity > 0.5) { // Apenas conexões fortes
          const commonKeywords = doc1.keywords.filter(k => doc2.keywords!.includes(k));
          
          edges.push({
            id: `${doc1.id}-${doc2.id}`,
            source: doc1.id,
            target: doc2.id,
            data: {
              strength: similarity,
              keywords: commonKeywords,
            },
          });
        }
      }
    }
  }
  
  return { nodes, edges };
}

export async function GET(request: NextRequest) {
  try {
    // Processar todos os documentos relevantes
    const documents = await processDocuments(baseDir);
    
    // Criar layout do mindmap
    const { nodes, edges } = createMindMapLayout(documents);
    
    return NextResponse.json({
      nodes,
      edges,
      stats: {
        totalDocuments: documents.length,
        totalConnections: edges.length,
        topics: Object.keys(KEYWORDS_RELATIONS),
      },
    });
  } catch (error) {
    console.error('Erro ao gerar mindmap:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar mindmap de relações' },
      { status: 500 }
    );
  }
}