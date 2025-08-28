#!/usr/bin/env python3
"""
Script para migrar arquivos do GlobalCoffee para a nova estrutura
Baseado no inventário gerado e na proposta de reorganização
"""

import hashlib
import json
import os
import re
import shutil
from collections import defaultdict
from datetime import datetime
from pathlib import Path


def carregar_inventario(arquivo_inventario="inventario_globalcoffee.json"):
    """Carrega o inventário de arquivos"""
    try:
        with open(arquivo_inventario, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Erro ao carregar inventário: {e}")
        return None


def gerar_novo_nome(arquivo_info, destino):
    """Gera novo nome seguindo padrão GC-[Categoria]-[Subcategoria]-[Descrição]-v[X.Y]"""

    nome_original = arquivo_info["nome"]
    extensao = arquivo_info["extensao"]
    tipo_doc = arquivo_info["tipo_documento"]
    persona = arquivo_info["persona"]
    versao = arquivo_info["versao"] or "1.0"

    # Extrair categoria e subcategoria do destino
    partes_destino = destino.split("/")

    if len(partes_destino) >= 2:
        categoria = (
            partes_destino[0].split("-")[1]
            if "-" in partes_destino[0]
            else partes_destino[0]
        )
        subcategoria = partes_destino[1]
    else:
        categoria = "Geral"
        subcategoria = "Docs"

    # Limpar nome base
    nome_base = re.sub(r"[^\w\s-]", "", arquivo_info["nome_base"])
    nome_base = re.sub(r"[-\s]+", "-", nome_base)

    # Gerar descrição
    descricao_partes = []

    # Adicionar tipo de documento
    if tipo_doc:
        descricao_partes.append(tipo_doc.title())

    # Adicionar persona se existir
    if persona:
        descricao_partes.append(persona.title())

    # Adicionar palavras-chave do nome original
    palavras_chave = [
        "api",
        "database",
        "fluxo",
        "processo",
        "template",
        "exemplo",
        "guia",
    ]
    for palavra in palavras_chave:
        if (
            palavra in nome_original.lower()
            and palavra not in " ".join(descricao_partes).lower()
        ):
            descricao_partes.append(palavra.title())

    # Se não tiver descrição, usar nome base
    if not descricao_partes:
        descricao_partes = [nome_base]

    descricao = "-".join(descricao_partes)

    # Formatar novo nome
    novo_nome = f"GC-{categoria}-{subcategoria}-{descricao}-v{versao}{extensao}"

    # Limpar caracteres especiais e espaços extras
    novo_nome = re.sub(r"[^\w\.-]", "-", novo_nome)
    novo_nome = re.sub(r"-+", "-", novo_nome)
    novo_nome = re.sub(r"^-|-$", "", novo_nome)

    return novo_nome


def copiar_arquivo_com_verificacao(origem, destino):
    """Copia arquivo com verificação de integridade"""
    try:
        # Criar diretório de destino se não existir
        os.makedirs(os.path.dirname(destino), exist_ok=True)

        # Copiar arquivo
        shutil.copy2(origem, destino)

        # Verificar integridade
        hash_origem = calcular_hash(origem)
        hash_destino = calcular_hash(destino)

        if hash_origem == hash_destino:
            return True, "Copiado com sucesso"
        else:
            os.remove(destino)
            return False, "Falha na verificação de integridade"

    except Exception as e:
        return False, str(e)


def calcular_hash(arquivo):
    """Calcula hash MD5 do arquivo"""
    hash_md5 = hashlib.md5()
    try:
        with open(arquivo, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except:
        return None


def processar_duplicatas(duplicatas_grupo, novo_destino_base):
    """Processa grupo de arquivos duplicados, mantendo o mais recente"""

    # Obter informações de todos os arquivos do grupo
    arquivos_info = []
    for caminho in duplicatas_grupo:
        try:
            stats = os.stat(caminho)
            arquivos_info.append(
                {
                    "caminho": caminho,
                    "nome": os.path.basename(caminho),
                    "data_modificacao": stats.st_mtime,
                    "tamanho": stats.st_size,
                }
            )
        except:
            continue

    if not arquivos_info:
        return None

    # Ordenar por data de modificação (mais recente primeiro)
    arquivos_info.sort(key=lambda x: x["data_modificacao"], reverse=True)

    # Retornar o mais recente
    return arquivos_info[0]["caminho"]


def migrar_arquivos(inventario, base_destino="GlobalCoffee_Reorganizado"):
    """Realiza a migração dos arquivos"""

    print("=== INICIANDO MIGRAÇÃO DE ARQUIVOS ===")
    
    # Verificar se inventário é lista ou dicionário
    if isinstance(inventario, list):
        arquivos_para_migrar = inventario
        total_arquivos = len(inventario)
        print(f"📋 Inventário em formato de lista detectado")
    elif isinstance(inventario, dict) and 'arquivos' in inventario:
        arquivos_para_migrar = inventario['arquivos']
        total_arquivos = inventario.get('total_arquivos', len(arquivos_para_migrar))
        print(f"📋 Inventário em formato de dicionário detectado")
    else:
        print("❌ Formato de inventário não reconhecido!")
        return None
        
    print(f"📊 Total de arquivos a migrar: {total_arquivos}\n")

    # Estatísticas
    stats = {
        "copiados": 0,
        "falhas": 0,
        "duplicatas_consolidadas": 0,
        "renomeados": 0,
        "arquivos_processados": [],
    }

    # Relatório de mudanças
    relatorio = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_arquivos": inventario["total_arquivos"],
        "mudancas": [],
    }

    # Processar duplicatas primeiro
    duplicatas_processadas = set()

    print("1. PROCESSANDO DUPLICATAS...")
    for hash_grupo, arquivos_grupo in inventario["duplicatas_potenciais"].items():
        if len(arquivos_grupo) > 1:
            arquivo_manter = processar_duplicatas(arquivos_grupo, base_destino)
            if arquivo_manter:
                duplicatas_processadas.update(arquivos_grupo)
                duplicatas_processadas.remove(arquivo_manter)
                stats["duplicatas_consolidadas"] += len(arquivos_grupo) - 1
                print(f"  ✓ Consolidado grupo com {len(arquivos_grupo)} duplicatas")

    print(f"\nTotal de duplicatas consolidadas: {stats['duplicatas_consolidadas']}")

    # Migrar arquivos
    print("\n2. MIGRANDO ARQUIVOS...")

    for i, arquivo_info in enumerate(inventario["arquivos"], 1):
        caminho_original = arquivo_info["caminho_original"]

        # Pular se for duplicata que não deve ser mantida
        if caminho_original in duplicatas_processadas:
            continue

        # Definir destino
        destino_dir = os.path.join(base_destino, arquivo_info["novo_destino"])

        # Gerar novo nome
        novo_nome = gerar_novo_nome(arquivo_info, arquivo_info["novo_destino"])

        # Verificar se nome mudou
        nome_mudou = novo_nome != arquivo_info["nome"]
        if nome_mudou:
            stats["renomeados"] += 1

        # Caminho completo de destino
        destino_completo = os.path.join(destino_dir, novo_nome)

        # Copiar arquivo
        sucesso, mensagem = copiar_arquivo_com_verificacao(
            caminho_original, destino_completo
        )

        if sucesso:
            stats["copiados"] += 1

            # Adicionar ao relatório
            relatorio["mudancas"].append(
                {
                    "tipo": "migrado",
                    "origem": caminho_original,
                    "destino": destino_completo,
                    "nome_original": arquivo_info["nome"],
                    "nome_novo": novo_nome,
                    "nome_mudou": nome_mudou,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
            )

            stats["arquivos_processados"].append(destino_completo)

            # Mostrar progresso
            if i % 100 == 0:
                print(f"  Processados: {i}/{inventario['total_arquivos']} arquivos")

        else:
            stats["falhas"] += 1
            print(f"  ✗ Falha ao copiar {caminho_original}: {mensagem}")

            relatorio["mudancas"].append(
                {
                    "tipo": "falha",
                    "origem": caminho_original,
                    "erro": mensagem,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
            )

    # Adicionar estatísticas ao relatório
    relatorio["estatisticas"] = stats

    print(f"\n=== MIGRAÇÃO CONCLUÍDA ===")
    print(f"✓ Arquivos copiados: {stats['copiados']}")
    print(f"✓ Arquivos renomeados: {stats['renomeados']}")
    print(f"✓ Duplicatas consolidadas: {stats['duplicatas_consolidadas']}")
    print(f"✗ Falhas: {stats['falhas']}")

    return relatorio


def salvar_relatorio(relatorio, arquivo_saida="relatorio_migracao.json"):
    """Salva relatório de migração"""
    try:
        with open(arquivo_saida, "w", encoding="utf-8") as f:
            json.dump(relatorio, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Relatório salvo em: {arquivo_saida}")
        return True
    except Exception as e:
        print(f"\n✗ Erro ao salvar relatório: {e}")
        return False


def gerar_relatorio_markdown(
    relatorio, arquivo_saida="RELATORIO-MIGRACAO-GLOBALCOFFEE.md"
):
    """Gera relatório em formato Markdown"""

    conteudo = f"""# Relatório de Migração - GlobalCoffee

**Data:** {relatorio['timestamp']}

## Resumo Executivo

- **Total de arquivos processados:** {relatorio['estatisticas']['copiados']}
- **Arquivos renomeados:** {relatorio['estatisticas']['renomeados']}
- **Duplicatas consolidadas:** {relatorio['estatisticas']['duplicatas_consolidadas']}
- **Falhas:** {relatorio['estatisticas']['falhas']}

## Mudanças Realizadas

### Arquivos Migrados e Renomeados

| Nome Original | Novo Nome | Localização Original | Nova Localização |
|---------------|-----------|---------------------|------------------|
"""

    # Adicionar arquivos migrados
    for mudanca in relatorio["mudancas"]:
        if mudanca["tipo"] == "migrado" and mudanca.get("nome_mudou", False):
            conteudo += f"| {mudanca['nome_original']} | {mudanca['nome_novo']} | {os.path.dirname(mudanca['origem'])} | {os.path.dirname(mudanca['destino'])} |\n"

    # Adicionar falhas se houver
    falhas = [m for m in relatorio["mudancas"] if m["tipo"] == "falha"]
    if falhas:
        conteudo += "\n### Falhas na Migração\n\n"
        for falha in falhas:
            conteudo += f"- **{falha['origem']}**: {falha['erro']}\n"

    conteudo += "\n## Nova Estrutura\n\n"
    conteudo += """```
GlobalCoffee_Reorganizado/
├── 1-Documentacao-Central/
│   ├── Visao-Geral/
│   ├── Especificacoes/
│   └── Guias/
├── 2-Documentacao-Tecnica/
│   ├── Arquitetura/
│   ├── APIs/
│   ├── Banco-de-Dados/
│   ├── Integracao/
│   └── Scripts/
├── 3-Por-Persona/
│   ├── Fornecedor/
│   ├── Compradores/
│   ├── Cooperativa/
│   └── Trader/
└── 4-Recursos/
    ├── Templates/
    ├── Exemplos/
    ├── Referencias/
    ├── Diagramas/
    └── Apresentacoes/
```"""

    try:
        with open(arquivo_saida, "w", encoding="utf-8") as f:
            f.write(conteudo)
        print(f"✓ Relatório Markdown salvo em: {arquivo_saida}")
        return True
    except Exception as e:
        print(f"✗ Erro ao salvar relatório Markdown: {e}")
        return False


def main():
    """Função principal"""
    print("MIGRAÇÃO DE ARQUIVOS - GLOBALCOFFEE")
    print("====================================\n")

    # Carregar inventário
    inventario = carregar_inventario()
    if not inventario:
        print("Erro: Não foi possível carregar o inventário!")
        return

    # Realizar migração
    relatorio = migrar_arquivos(inventario)

    # Salvar relatórios
    salvar_relatorio(relatorio)
    gerar_relatorio_markdown(relatorio)

    print("\n✓ MIGRAÇÃO CONCLUÍDA COM SUCESSO!")
    print("Próximo passo: verificar integridade e remover estrutura antiga")


if __name__ == "__main__":
    main()
