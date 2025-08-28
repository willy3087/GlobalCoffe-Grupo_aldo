import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Mudando para mostrar os arquivos principais do projeto
const baseDir = path.resolve(process.cwd());

// Lista de diretórios para ignorar
const IGNORED_DIRS = [
  'node_modules', '.git', '.next', 'GlobalCoffee_Reorganizado/temp',
  'GlobalCoffee_Reorganizado/outros', 'GlobalCoffee_Reorganizado/duplicados',
  '.pnpm', 'dist', 'build', 'coverage', '.cache'
];

// Lista de extensões relevantes
const RELEVANT_EXTENSIONS = [
  '.md', '.docx', '.pdf', '.txt', '.mmd', '.html', '.json', '.tsx', '.ts', '.js'
];

async function readDirRecursive(dirPath: string, depth: number = 0, maxDepth: number = 3): Promise<any[]> {
  if (depth > maxDepth) return [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const result = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(baseDir, fullPath);
        
        // Ignorar diretórios específicos e arquivos ocultos
        if (entry.name.startsWith('.') || IGNORED_DIRS.some(ignored => relativePath.includes(ignored))) {
          return null;
        }
        
        if (entry.isDirectory()) {
          const children = await readDirRecursive(fullPath, depth + 1, maxDepth);
          // Só retornar diretórios que têm conteúdo
          if (children.length > 0) {
            return {
              name: entry.name,
              type: "directory" as const,
              children: children.filter(Boolean),
            };
          }
          return null;
        } else {
          // Filtrar apenas arquivos com extensões relevantes
          const ext = path.extname(entry.name).toLowerCase();
          if (RELEVANT_EXTENSIONS.includes(ext)) {
            return {
              name: entry.name,
              type: "file" as const,
              path: relativePath.replace(/\\\\/g, "/").replace(/\\/g, "/"),
            };
          }
          return null;
        }
      })
    );
    return result.filter(Boolean);
  } catch (error) {
    console.error(`Erro ao ler diretório ${dirPath}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const contentPath = url.searchParams.get("path");

  if (contentPath) {
    // Retorna o conteúdo do arquivo solicitado
    const safePath = path
      .normalize(contentPath)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const fullPath = path.join(baseDir, safePath);
    try {
      const content = await fs.readFile(fullPath, "utf-8");
      return NextResponse.json({ content });
    } catch (error) {
      return NextResponse.json(
        { error: "Arquivo não encontrado ou não pode ser lido." },
        { status: 404 }
      );
    }
  } else {
    // Retorna a estrutura de arquivos e pastas com cache
    try {
      const tree = await readDirRecursive(baseDir);
      return NextResponse.json(tree, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao ler a estrutura de documentos." },
        { status: 500 }
      );
    }
  }
}
