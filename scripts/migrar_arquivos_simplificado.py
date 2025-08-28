#!/usr/bin/env python3
"""
Script de migração simplificado para GlobalCoffee
Funciona com o inventário atual em formato de lista
"""

import json
import os
import shutil
from datetime import datetime
from pathlib import Path


def carregar_inventario(arquivo="inventario_globalcoffee.json"):
    """Carrega o inventário de arquivos"""
    try:
        with open(arquivo, "r", encoding="utf-8") as f:
            inventario = json.load(f)
        print(f"✅ Inventário carregado: {len(inventario)} arquivos")
        return inventario
    except Exception as e:
        print(f"❌ Erro ao carregar inventário: {e}")
        return None


def criar_estrutura_diretorios(base_dir="GlobalCoffee_Reorganizado"):
    """Cria a estrutura de diretórios necessária"""
    estrutura = {
        "docs": {
            "business": ["features", "requirements", "analysis"],
            "technical": ["architecture", "api", "database"],
            "user": ["guides", "tutorials", "faq"]
        },
        "src": {
            "components": [],
            "pages": [],
            "styles": [],
            "scripts": [],
            "assets": ["images", "icons", "fonts"]
        },
        "data": {
            "transcricoes": [],
            "reports": [],
            "exports": []
        },
        "config": [],
        "temp": [],
        "backup": []
    }
    
    print(f"📁 Criando estrutura de diretórios em {base_dir}...")
    
    def criar_dirs(caminho_base, estrutura_dict):
        for pasta, subpastas in estrutura_dict.items():
            caminho_pasta = os.path.join(caminho_base, pasta)
            os.makedirs(caminho_pasta, exist_ok=True)
            
            if isinstance(subpastas, dict):
                criar_dirs(caminho_pasta, subpastas)
            elif isinstance(subpastas, list):
                for subpasta in subpastas:
                    os.makedirs(os.path.join(caminho_pasta, subpasta), exist_ok=True)
    
    criar_dirs(base_dir, estrutura)
    print("✅ Estrutura de diretórios criada!")


def mapear_destino(arquivo_info):
    """Mapeia arquivo para destino baseado em tipo e extensão"""
    nome = arquivo_info.get("current_location", "").lower()
    extensao = arquivo_info.get("extension", "").lower()
    
    # Transcrições
    if "transcri" in nome or "reuniao" in nome:
        return "data/transcricoes"
    
    # Documentação de negócio
    if any(palavra in nome for palavra in ["relatorio", "analise", "funcionalidade", "persona", "requisito"]):
        return "docs/business/analysis"
    
    # Documentação técnica
    if any(palavra in nome for palavra in ["api", "schema", "config", "setup"]):
        return "docs/technical/api"
    
    # Componentes React/TSX
    if extensao in [".tsx", ".jsx"]:
        return "src/components"
    
    # Páginas
    if "page" in nome and extensao in [".tsx", ".jsx"]:
        return "src/pages"
    
    # Estilos
    if extensao in [".css", ".scss", ".sass"]:
        return "src/styles"
    
    # Scripts
    if extensao in [".py", ".js", ".ts"] and "script" in nome:
        return "src/scripts"
    
    # Configurações
    if extensao in [".json", ".yaml", ".yml", ".toml"] and any(palavra in nome for palavra in ["config", "package", "tsconfig"]):
        return "config"
    
    # Imagens
    if extensao in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]:
        return "src/assets/images"
    
    # Documentos Word/PDF
    if extensao in [".docx", ".pdf"]:
        return "data/reports"
    
    # Markdown geral
    if extensao == ".md":
        return "docs/business/features"
    
    # Outros arquivos
    return "temp"


def migrar_arquivo(arquivo_info, base_destino, stats):
    """Migra um arquivo individual"""
    origem = arquivo_info.get("current_location")
    if not origem or not os.path.exists(origem):
        stats["nao_encontrados"] += 1
        return False
    
    # Determinar destino
    destino_relativo = mapear_destino(arquivo_info)
    destino_dir = os.path.join(base_destino, destino_relativo)
    
    # Criar diretório se não existir
    os.makedirs(destino_dir, exist_ok=True)
    
    # Nome do arquivo
    nome_arquivo = os.path.basename(origem)
    destino_completo = os.path.join(destino_dir, nome_arquivo)
    
    # Verificar se já existe
    if os.path.exists(destino_completo):
        # Criar nome único
        base, ext = os.path.splitext(nome_arquivo)
        contador = 1
        while os.path.exists(destino_completo):
            novo_nome = f"{base}_v{contador}{ext}"
            destino_completo = os.path.join(destino_dir, novo_nome)
            contador += 1
        stats["renomeados"] += 1
    
    try:
        # Copiar arquivo
        shutil.copy2(origem, destino_completo)
        stats["copiados"] += 1
        stats["arquivos_migrados"].append({
            "origem": origem,
            "destino": destino_completo,
            "categoria": destino_relativo
        })
        return True
    except Exception as e:
        print(f"❌ Erro ao copiar {origem}: {e}")
        stats["falhas"] += 1
        return False


def migrar_transcricoes_especiais(base_destino, stats):
    """Migra especificamente a pasta de transcrições"""
    pasta_transcricoes = "Trancrições"
    if not os.path.exists(pasta_transcricoes):
        print("⚠️  Pasta de transcrições não encontrada")
        return
    
    print("🎤 Migrando transcrições...")
    destino_transcricoes = os.path.join(base_destino, "data", "transcricoes")
    os.makedirs(destino_transcricoes, exist_ok=True)
    
    for root, dirs, files in os.walk(pasta_transcricoes):
        for arquivo in files:
            origem = os.path.join(root, arquivo)
            # Manter estrutura de subpastas
            rel_path = os.path.relpath(root, pasta_transcricoes)
            if rel_path == ".":
                destino_final = os.path.join(destino_transcricoes, arquivo)
            else:
                destino_dir = os.path.join(destino_transcricoes, rel_path)
                os.makedirs(destino_dir, exist_ok=True)
                destino_final = os.path.join(destino_dir, arquivo)
            
            try:
                shutil.copy2(origem, destino_final)
                stats["transcricoes_migradas"] += 1
                print(f"  ✅ {arquivo}")
            except Exception as e:
                print(f"  ❌ Erro ao migrar {arquivo}: {e}")


def gerar_relatorio(stats, tempo_total):
    """Gera relatório da migração"""
    relatorio = {
        "timestamp": datetime.now().isoformat(),
        "tempo_total_segundos": tempo_total,
        "estatisticas": stats,
        "resumo": {
            "total_processados": stats["copiados"] + stats["falhas"],
            "taxa_sucesso": f"{(stats['copiados'] / max(1, stats['copiados'] + stats['falhas'])) * 100:.1f}%"
        }
    }
    
    # Salvar JSON
    with open("relatorio_migracao_simplificado.json", "w", encoding="utf-8") as f:
        json.dump(relatorio, f, indent=2, ensure_ascii=False)
    
    # Relatório em texto
    with open("RELATORIO_MIGRACAO_SIMPLIFICADO.md", "w", encoding="utf-8") as f:
        f.write("# Relatório de Migração GlobalCoffee\n\n")
        f.write(f"**Data:** {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write(f"**Tempo total:** {tempo_total:.2f} segundos\n\n")
        f.write("## Estatísticas\n\n")
        f.write(f"- ✅ Arquivos copiados: {stats['copiados']}\n")
        f.write(f"- ❌ Falhas: {stats['falhas']}\n")
        f.write(f"- 🔄 Renomeados: {stats['renomeados']}\n")
        f.write(f"- 📁 Não encontrados: {stats['nao_encontrados']}\n")
        f.write(f"- 🎤 Transcrições migradas: {stats['transcricoes_migradas']}\n")
        f.write(f"- 📊 Taxa de sucesso: {relatorio['resumo']['taxa_sucesso']}\n\n")
        
        if stats["arquivos_migrados"]:
            f.write("## Arquivos Migrados\n\n")
            for arquivo in stats["arquivos_migrados"][:20]:  # Primeiros 20
                f.write(f"- `{arquivo['origem']}` → `{arquivo['destino']}`\n")
            if len(stats["arquivos_migrados"]) > 20:
                f.write(f"\n... e mais {len(stats['arquivos_migrados']) - 20} arquivos.\n")


def main():
    """Função principal"""
    print("🚀 MIGRAÇÃO SIMPLIFICADA - GLOBALCOFFEE")
    print("=" * 50)
    
    inicio = datetime.now()
    
    # Carregar inventário
    inventario = carregar_inventario()
    if not inventario:
        return
    
    # Criar estrutura
    base_destino = "GlobalCoffee_Reorganizado"
    criar_estrutura_diretorios(base_destino)
    
    # Estatísticas
    stats = {
        "copiados": 0,
        "falhas": 0,
        "renomeados": 0,
        "nao_encontrados": 0,
        "transcricoes_migradas": 0,
        "arquivos_migrados": []
    }
    
    # Migrar transcrições primeiro
    migrar_transcricoes_especiais(base_destino, stats)
    
    # Migrar arquivos do inventário
    print(f"\n📦 Migrando {len(inventario)} arquivos do inventário...")
    
    for i, arquivo_info in enumerate(inventario, 1):
        if i % 100 == 0:
            print(f"  Processados: {i}/{len(inventario)}")
        
        migrar_arquivo(arquivo_info, base_destino, stats)
    
    # Tempo total
    fim = datetime.now()
    tempo_total = (fim - inicio).total_seconds()
    
    # Gerar relatório
    gerar_relatorio(stats, tempo_total)
    
    # Resultado final
    print(f"\n🎉 MIGRAÇÃO CONCLUÍDA!")
    print(f"⏱️  Tempo total: {tempo_total:.2f} segundos")
    print(f"✅ Arquivos copiados: {stats['copiados']}")
    print(f"❌ Falhas: {stats['falhas']}")
    print(f"🔄 Renomeados: {stats['renomeados']}")
    print(f"🎤 Transcrições migradas: {stats['transcricoes_migradas']}")
    print(f"\n📄 Relatórios gerados:")
    print("  - relatorio_migracao_simplificado.json")
    print("  - RELATORIO_MIGRACAO_SIMPLIFICADO.md")


if __name__ == "__main__":
    main()
